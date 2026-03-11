import { Types } from 'mongoose'
import Store from '~/models/schemas/Store.schema.js'
import User from '~/models/schemas/User.schema.js'
import { ErrorWithStatus } from '~/middlewares/error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { JoinRequestStatus, UserRole } from '~/constants/enum.js'
import { STORES_MESSAGES } from '~/constants/messages.js'

class StoresService {
  private parseObjectId(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.REQUEST_ID_MUST_BE_MONGO_ID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }
    return new Types.ObjectId(value)
  }

  private async getUserById(user_id: string) {
    const user = await User.findById(user_id).select('user_id role store_id full_name phone_number')
    if (!user) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.OWNER_STORE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }

  private async getOwnerStore(owner_user_id: string) {
    const owner = await this.getUserById(owner_user_id)
    if (owner.role !== UserRole.Owner) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.ONLY_OWNER_CAN_REVIEW_JOIN_REQUESTS,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const ownerStoreId = owner.store_id ? String(owner.store_id) : ''
    if (!ownerStoreId) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.OWNER_STORE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const store = await Store.findOne({
      owner_id: owner._id,
      $or: [{ store_id: new Types.ObjectId(ownerStoreId) }, { _id: new Types.ObjectId(ownerStoreId) }]
    })

    if (!store) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.OWNER_STORE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return { owner, store }
  }

  async generateStoreQr(owner_user_id: string) {
    const { owner, store } = await this.getOwnerStore(owner_user_id)
    if (owner.role !== UserRole.Owner) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.ONLY_OWNER_CAN_GENERATE_QR,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const normalizedStoreId = String((store as any).store_id ?? store._id)
    store.qr_code = normalizedStoreId
    await store.save()

    return {
      store_id: normalizedStoreId,
      store_name: store.name,
      qr_code: store.qr_code
    }
  }

  async requestJoinStoreByQr(staff_user_id: string, qr_code: string) {
    const staff = await this.getUserById(staff_user_id)
    if (staff.role !== UserRole.Staff) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.ONLY_STAFF_CAN_JOIN_BY_QR,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (staff.store_id) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.STAFF_ALREADY_IN_STORE,
        status: HTTP_STATUS.CONFLICT
      })
    }

    const trimmedQrCode = qr_code.trim()
    const parsedId = Types.ObjectId.isValid(trimmedQrCode) ? new Types.ObjectId(trimmedQrCode) : null

    const store = await Store.findOne(
      parsedId
        ? {
            $or: [{ qr_code: trimmedQrCode }, { store_id: parsedId }, { _id: parsedId }]
          }
        : {
            qr_code: trimmedQrCode
          }
    )

    if (!store) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.STORE_NOT_FOUND_BY_QR,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const hasPending = (store.join_requests || []).some(
      (request) => String(request.staff_user_id) === String(staff._id) && request.status === JoinRequestStatus.Pending
    )

    if (hasPending) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.STAFF_JOIN_REQUEST_ALREADY_PENDING,
        status: HTTP_STATUS.CONFLICT
      })
    }

    const request_id = new Types.ObjectId()
    store.join_requests.push({
      request_id,
      staff_user_id: staff._id,
      status: JoinRequestStatus.Pending,
      requested_at: new Date(),
      reviewed_at: null,
      reviewed_by: null
    })
    await store.save()

    return {
      request_id: String(request_id),
      store_id: String((store as any).store_id ?? store._id),
      store_name: store.name,
      staff_user_id: String((staff as any).user_id ?? staff._id),
      status: JoinRequestStatus.Pending,
      requested_at: new Date()
    }
  }

  async getPendingJoinRequests(owner_user_id: string) {
    const { store } = await this.getOwnerStore(owner_user_id)
    const pendingRequests = (store.join_requests || []).filter(
      (request) => request.status === JoinRequestStatus.Pending
    )

    const staffIds = pendingRequests.map((request) => request.staff_user_id)
    const staffs = await User.find({ _id: { $in: staffIds } }).select('user_id full_name phone_number role')
    const staffById = new Map<string, (typeof staffs)[number]>()
    staffs.forEach((staff) => {
      staffById.set(String(staff._id), staff)
    })

    return pendingRequests.map((request) => {
      const staff = staffById.get(String(request.staff_user_id))
      return {
        request_id: String(request.request_id),
        staff_user_id: staff ? String((staff as any).user_id ?? staff._id) : String(request.staff_user_id),
        staff_full_name: staff?.full_name ?? null,
        staff_phone_number: staff?.phone_number ?? null,
        status: request.status,
        requested_at: request.requested_at
      }
    })
  }

  async approveJoinRequest(owner_user_id: string, request_id: string) {
    const { store, owner } = await this.getOwnerStore(owner_user_id)
    const parsedRequestId = this.parseObjectId(request_id)

    const request = (store.join_requests || []).find((item) => String(item.request_id) === String(parsedRequestId))

    if (!request) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.JOIN_REQUEST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (request.status !== JoinRequestStatus.Pending) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.JOIN_REQUEST_NOT_PENDING,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const staff = await User.findById(request.staff_user_id)
    if (!staff || staff.role !== UserRole.Staff) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.JOIN_REQUEST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (staff.store_id && String(staff.store_id) !== String(store._id)) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.STAFF_ALREADY_IN_STORE,
        status: HTTP_STATUS.CONFLICT
      })
    }

    staff.store_id = store._id as any
    await staff.save()

    request.status = JoinRequestStatus.Approved
    request.reviewed_at = new Date()
    request.reviewed_by = owner._id
    await store.save()

    return {
      request_id: String(request.request_id),
      status: request.status,
      staff_user_id: String((staff as any).user_id ?? staff._id),
      store_id: String((store as any).store_id ?? store._id),
      store_name: store.name
    }
  }

  async rejectJoinRequest(owner_user_id: string, request_id: string) {
    const { store, owner } = await this.getOwnerStore(owner_user_id)
    const parsedRequestId = this.parseObjectId(request_id)

    const request = (store.join_requests || []).find((item) => String(item.request_id) === String(parsedRequestId))

    if (!request) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.JOIN_REQUEST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (request.status !== JoinRequestStatus.Pending) {
      throw new ErrorWithStatus({
        message: STORES_MESSAGES.JOIN_REQUEST_NOT_PENDING,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    request.status = JoinRequestStatus.Rejected
    request.reviewed_at = new Date()
    request.reviewed_by = owner._id
    await store.save()

    return {
      request_id: String(request.request_id),
      status: request.status
    }
  }
}

const storesService = new StoresService()
export default storesService
