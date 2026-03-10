import { Request, Response } from 'express'
import ordersService from '~/services/orders.services.js'
import { ORDERS_MESSAGES } from '~/constants/messages.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const getOrdersController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await ordersService.getOrders(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDERS_MESSAGES.GET_ORDERS_SUCCESS,
    result
  })
}

export const getOrderController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const id = String(req.params.id)
  const result = await ordersService.getOrder(user_id, id)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDERS_MESSAGES.GET_ORDER_SUCCESS,
    result
  })
}

export const createOrderController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await ordersService.createOrder(user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: ORDERS_MESSAGES.CREATE_ORDER_SUCCESS,
    result
  })
}
