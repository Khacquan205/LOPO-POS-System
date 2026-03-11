import { Request, Response } from 'express'
import storesService from '~/services/stores.services.js'
import { STORES_MESSAGES } from '~/constants/messages.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const generateStoreQrController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id || '')
  const result = await storesService.generateStoreQr(user_id)
  return res.status(HTTP_STATUS.CREATED).json({
    message: STORES_MESSAGES.GENERATE_STORE_QR_SUCCESS,
    result
  })
}

export const requestJoinStoreByQrController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id || '')
  const qr_code = String(req.body.qr_code || '')
  const result = await storesService.requestJoinStoreByQr(user_id, qr_code)
  return res.status(HTTP_STATUS.CREATED).json({
    message: STORES_MESSAGES.REQUEST_JOIN_STORE_SUCCESS,
    result
  })
}

export const getPendingJoinRequestsController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id || '')
  const result = await storesService.getPendingJoinRequests(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: STORES_MESSAGES.GET_PENDING_JOIN_REQUESTS_SUCCESS,
    result
  })
}

export const approveJoinRequestController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id || '')
  const request_id = String(req.params.request_id || '')
  const result = await storesService.approveJoinRequest(user_id, request_id)
  return res.status(HTTP_STATUS.OK).json({
    message: STORES_MESSAGES.APPROVE_JOIN_REQUEST_SUCCESS,
    result
  })
}

export const rejectJoinRequestController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id || '')
  const request_id = String(req.params.request_id || '')
  const result = await storesService.rejectJoinRequest(user_id, request_id)
  return res.status(HTTP_STATUS.OK).json({
    message: STORES_MESSAGES.REJECT_JOIN_REQUEST_SUCCESS,
    result
  })
}
