import { Router } from 'express'
import {
  getProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController
} from '~/controllers/products.controllers.js'
import { accessTokenValidator } from '~/middlewares/users.middlewares.js'
import { createProductValidator, updateProductValidator } from '~/middlewares/products.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const productsRouter = Router()

// Tất cả routes yêu cầu đăng nhập (cả owner và staff đều dùng được)
productsRouter.get('/', accessTokenValidator, wrapRequestHandler(getProductsController))
productsRouter.get('/:id', accessTokenValidator, wrapRequestHandler(getProductController))
productsRouter.post('/', accessTokenValidator, createProductValidator, wrapRequestHandler(createProductController))
productsRouter.put('/:id', accessTokenValidator, updateProductValidator, wrapRequestHandler(updateProductController))
productsRouter.delete('/:id', accessTokenValidator, wrapRequestHandler(deleteProductController))

export default productsRouter
