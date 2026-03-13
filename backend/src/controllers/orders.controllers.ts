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
  const order_id = String(req.params.order_id)
  const result = await ordersService.getOrder(user_id, order_id)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDERS_MESSAGES.GET_ORDER_SUCCESS,
    result
  })
}

export const createOrderController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await ordersService.createDraftOrder(user_id)
  return res.status(HTTP_STATUS.CREATED).json({
    message: ORDERS_MESSAGES.CREATE_ORDER_SUCCESS,
    result
  })
}

export const updateOrderItemsController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const order_id = String(req.params.order_id)
  const result = await ordersService.updateOrderItems(user_id, order_id, req.body.items)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDERS_MESSAGES.UPDATE_ORDER_ITEMS_SUCCESS,
    result
  })
}

export const checkoutOrderController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const order_id = String(req.params.order_id)
  const result = await ordersService.checkoutOrder(user_id, order_id, req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDERS_MESSAGES.CHECKOUT_ORDER_SUCCESS,
    result
  })
}

export const cancelOrderController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const order_id = String(req.params.order_id)
  const result = await ordersService.cancelOrder(user_id, order_id)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDERS_MESSAGES.CANCEL_ORDER_SUCCESS,
    result
  })
}
