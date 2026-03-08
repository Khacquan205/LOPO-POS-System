import { Router } from 'express'
import { getOrdersController, getOrderController, createOrderController } from '~/controllers/orders.controllers.js'
import { accessTokenValidator } from '~/middlewares/users.middlewares.js'
import { createOrderValidator } from '~/middlewares/orders.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const ordersRouter = Router()

ordersRouter.get('/', accessTokenValidator, wrapRequestHandler(getOrdersController))
ordersRouter.get('/:id', accessTokenValidator, wrapRequestHandler(getOrderController))
ordersRouter.post('/', accessTokenValidator, createOrderValidator, wrapRequestHandler(createOrderController))

export default ordersRouter
