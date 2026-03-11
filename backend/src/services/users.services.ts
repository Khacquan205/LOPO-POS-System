import { Types } from 'mongoose'
import User from '~/models/schemas/User.schema.js'
import Store from '~/models/schemas/Store.schema.js'
import RefreshToken from '~/models/schemas/RefreshToken.schema.js'
import { hashPassword, comparePassword } from '~/utils/crypto.js'
import { signToken, verifyToken } from '~/utils/jwt.js'
import { TokenType, UserRole, UserStatus } from '~/constants/enum.js'
import { envConfig } from '~/config/index.js'
import { ErrorWithStatus } from '~/middlewares/error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { USERS_MESSAGES } from '~/constants/messages.js'

interface RegisterOwnerReqBody {
  store_name: string
  full_name: string
  phone_number: string
  password: string
  confirm_password: string
}

interface RegisterStaffReqBody {
  full_name: string
  phone_number: string
  password: string
  confirm_password: string
}

interface LoginReqBody {
  phone_number: string
  password: string
}

class UsersService {
  private serializeUser(user: unknown) {
    const doc = user as { toObject?: () => Record<string, unknown> }
    const raw = doc.toObject ? doc.toObject() : (user as Record<string, unknown>)
    const normalizedUserId = String(raw.user_id ?? raw._id)
    delete raw._id
    delete raw.user_id
    return {
      user_id: normalizedUserId,
      ...raw
    }
  }

  private async createStaffAccount(payload: RegisterStaffReqBody, store_id?: string) {
    const phoneExisted = await this.checkPhoneNumberExists(payload.phone_number)
    if (phoneExisted) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.PHONE_NUMBER_ALREADY_EXISTS,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    const staff = await User.create({
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      password: hashPassword(payload.password),
      role: UserRole.Staff,
      store_id: store_id ? new Types.ObjectId(store_id) : null,
      status: UserStatus.Active
    })

    const user_id = staff._id.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id, staff.role)

    await RefreshToken.create({
      user_id: new Types.ObjectId(user_id),
      token: refresh_token
    })

    return {
      access_token,
      refresh_token,
      staff: {
        user_id: String((staff as any).user_id ?? staff._id),
        full_name: staff.full_name,
        phone_number: staff.phone_number,
        role: staff.role,
        created_at: staff.createdAt,
        updated_at: staff.updatedAt
      }
    }
  }

  private signAccessToken(user_id: string, role: string) {
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: envConfig.jwt.accessExpiresIn as any
      },
      secretOrPrivateKey: envConfig.jwt.accessSecret
    })
  }

  private signRefreshToken(user_id: string, role: string) {
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: envConfig.jwt.refreshExpiresIn as any
      },
      secretOrPrivateKey: envConfig.jwt.refreshSecret
    })
  }

  private signAccessAndRefreshToken(user_id: string, role: string) {
    return Promise.all([this.signAccessToken(user_id, role), this.signRefreshToken(user_id, role)])
  }

  async checkPhoneNumberExists(phone_number: string) {
    const user = await User.findOne({ phone_number })
    return Boolean(user)
  }

  async registerOwner(payload: RegisterOwnerReqBody) {
    const user = await User.create({
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      password: hashPassword(payload.password),
      role: UserRole.Owner,
      status: UserStatus.Active
    })

    const store = await Store.create({
      name: payload.store_name,
      owner_id: user._id
    })

    store.qr_code = String((store as any).store_id ?? store._id)
    await store.save()

    // Gán store_id cho owner
    user.store_id = store._id as any
    await user.save()

    const user_id = user._id.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id, user.role)

    await RefreshToken.create({
      user_id: new Types.ObjectId(user_id),
      token: refresh_token
    })

    return {
      access_token,
      refresh_token,
      owner: {
        user_id: String((user as any).user_id ?? user._id),
        full_name: user.full_name,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      },
      store: {
        store_id: String((store as any).store_id ?? store._id),
        name: store.name,
        owner_id: store.owner_id,
        created_at: store.createdAt,
        updated_at: store.updatedAt
      }
    }
  }

  async registerStaffByOwner(owner_user_id: string, payload: RegisterStaffReqBody) {
    const owner = await User.findById(owner_user_id)
    if (!owner || owner.role !== UserRole.Owner) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ONLY_OWNER_CAN_CREATE_STAFF,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const store_id = owner.store_id ? owner.store_id.toString() : undefined
    return this.createStaffAccount(payload, store_id)
  }

  async registerStaff(payload: RegisterStaffReqBody) {
    return this.createStaffAccount(payload)
  }

  async login(payload: LoginReqBody) {
    const user = await User.findOne({ phone_number: payload.phone_number })
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.PHONE_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    if (user.status === UserStatus.Inactive) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCOUNT_IS_INACTIVE,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (user.status === UserStatus.Blocked) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCOUNT_IS_BLOCKED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const matched = await comparePassword(payload.password, user.password)
    if (!matched) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.PHONE_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const user_id = user._id.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id, user.role)

    await RefreshToken.create({
      user_id: new Types.ObjectId(user_id),
      token: refresh_token
    })

    // Lấy store name nếu user có store_id
    let store_name: string | null = null
    if (user.store_id) {
      const store = await Store.findById(user.store_id)
      store_name = store?.name ?? null
    }

    return {
      access_token,
      refresh_token,
      user: {
        user_id: String((user as any).user_id ?? user._id),
        full_name: user.full_name,
        phone_number: user.phone_number,
        role: user.role,
        store_id: user.store_id ?? null,
        store_name
      }
    }
  }

  async logout(refresh_token: string) {
    await RefreshToken.deleteOne({ token: refresh_token })
  }

  async refreshToken(refresh_token: string) {
    const tokenDoc = await RefreshToken.findOne({ token: refresh_token })
    if (!tokenDoc) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const decoded = await verifyToken({ token: refresh_token, secretOrPublicKey: envConfig.jwt.refreshSecret })
    const user_id = String(decoded.user_id)
    const role = String(decoded.role)

    const [access_token, new_refresh_token] = await this.signAccessAndRefreshToken(user_id, role)

    await RefreshToken.deleteOne({ token: refresh_token })
    await RefreshToken.create({ user_id: new Types.ObjectId(user_id), token: new_refresh_token })

    return { access_token, refresh_token: new_refresh_token }
  }

  async getMe(user_id: string) {
    const user = await User.findById(user_id).select('-password')
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const normalizedStoreId = user.store_id ? String(user.store_id) : null
    return {
      ...this.serializeUser(user),
      store_id: normalizedStoreId,
      store_qr_code: normalizedStoreId
    }
  }
}

const usersService = new UsersService()
export default usersService
