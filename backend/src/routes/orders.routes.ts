import { Router } from 'express'
import {
  getOrdersController,
  getOrderController,
  createOrderController,
  updateOrderItemsController,
  checkoutOrderController,
  cancelOrderController
} from '~/controllers/orders.controllers.js'
import { accessTokenValidator } from '~/middlewares/users.middlewares.js'
import { updateOrderItemsValidator, checkoutOrderValidator } from '~/middlewares/orders.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const ordersRouter = Router()

ordersRouter.get('/', accessTokenValidator, wrapRequestHandler(getOrdersController))
ordersRouter.post('/', accessTokenValidator, wrapRequestHandler(createOrderController))
ordersRouter.get('/:order_id', accessTokenValidator, wrapRequestHandler(getOrderController))
ordersRouter.put('/:order_id/items', accessTokenValidator, updateOrderItemsValidator, wrapRequestHandler(updateOrderItemsController))
ordersRouter.post('/:order_id/checkout', accessTokenValidator, checkoutOrderValidator, wrapRequestHandler(checkoutOrderController))
ordersRouter.patch('/:order_id/cancel', accessTokenValidator, wrapRequestHandler(cancelOrderController))

export default ordersRouter
