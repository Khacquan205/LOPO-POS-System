import { Request, Response } from 'express'
import categoriesService from '~/services/categories.services.js'
import { CATEGORIES_MESSAGES } from '~/constants/messages.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const getCategoriesController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await categoriesService.getCategories(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: CATEGORIES_MESSAGES.GET_CATEGORIES_SUCCESS,
    result
  })
}

export const getCategoryController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const category_id = String(req.params.category_id || req.query.category_id)
  const result = await categoriesService.getCategory(user_id, category_id)
  return res.status(HTTP_STATUS.OK).json({
    message: CATEGORIES_MESSAGES.GET_CATEGORY_SUCCESS,
    result
  })
}

export const createCategoryController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await categoriesService.createCategory(user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: CATEGORIES_MESSAGES.CREATE_CATEGORY_SUCCESS,
    result
  })
}

export const updateCategoryController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const category_id = String(req.params.category_id)
  const result = await categoriesService.updateCategory(user_id, category_id, req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: CATEGORIES_MESSAGES.UPDATE_CATEGORY_SUCCESS,
    result
  })
}

export const deleteCategoryController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const category_id = String(req.params.category_id)
  await categoriesService.deleteCategory(user_id, category_id)
  return res.status(HTTP_STATUS.OK).json({
    message: CATEGORIES_MESSAGES.DELETE_CATEGORY_SUCCESS
  })
}
