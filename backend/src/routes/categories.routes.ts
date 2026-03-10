import { Router } from 'express'
import {
  getCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController
} from '~/controllers/categories.controllers.js'
import { accessTokenValidator } from '~/middlewares/users.middlewares.js'
import { createCategoryValidator, updateCategoryValidator } from '~/middlewares/categories.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const categoriesRouter = Router()

// Tất cả routes yêu cầu đăng nhập (cả owner và staff đều dùng được)
categoriesRouter.get('/', accessTokenValidator, wrapRequestHandler(getCategoriesController))
categoriesRouter.post('/', accessTokenValidator, createCategoryValidator, wrapRequestHandler(createCategoryController))
categoriesRouter.put(
  '/:id',
  accessTokenValidator,
  updateCategoryValidator,
  wrapRequestHandler(updateCategoryController)
)
categoriesRouter.delete('/:id', accessTokenValidator, wrapRequestHandler(deleteCategoryController))

export default categoriesRouter
