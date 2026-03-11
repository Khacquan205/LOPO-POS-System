import { Request, Response } from 'express'
import usersService from '~/services/users.services.js'
import { USERS_MESSAGES } from '~/constants/messages.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const registerController = async (req: Request, res: Response) => {
  const result = await usersService.registerOwner(req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const registerStaffController = async (req: Request, res: Response) => {
  const owner_user_id = String(req.decoded_authorization?.user_id || '')
  const result = await usersService.registerStaffByOwner(owner_user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.REGISTER_STAFF_SUCCESS,
    result
  })
}

export const registerStaffPublicController = async (req: Request, res: Response) => {
  const result = await usersService.registerStaff(req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.REGISTER_STAFF_SELF_SUCCESS,
    result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const result = await usersService.login(req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  await usersService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}

export const meController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id || '')
  const result = await usersService.getMe(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result
  })
}

export const getStaffsController = async (req: Request, res: Response) => {
  const owner_user_id = String(req.decoded_authorization?.user_id || '')
  const result = await usersService.getStaffsInStore(owner_user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_STAFFS_SUCCESS,
    result
  })
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.refreshToken(refresh_token)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
}

export const updateStaffStatusController = async (req: Request, res: Response) => {
  const owner_user_id = String(req.decoded_authorization?.user_id || '')
  const staff_id = String(req.params.staff_id || '')
  const { status } = req.body
  const result = await usersService.updateStaffStatus(owner_user_id, staff_id, status)
  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.UPDATE_STAFF_STATUS_SUCCESS,
    result
  })
}
