import { Request, Response } from 'express'
import productsService from '~/services/products.services.js'
import { PRODUCTS_MESSAGES } from '~/constants/messages.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const getProductsController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await productsService.getProducts(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.GET_PRODUCTS_SUCCESS,
    result
  })
}

export const getProductController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const product_id = String(req.params.product_id || req.query.product_id)
  const result = await productsService.getProduct(user_id, product_id)
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.GET_PRODUCT_SUCCESS,
    result
  })
}

export const createProductController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await productsService.createProduct(user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: PRODUCTS_MESSAGES.CREATE_PRODUCT_SUCCESS,
    result
  })
}

export const updateProductController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const product_id = String(req.params.product_id)
  const result = await productsService.updateProduct(user_id, product_id, req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    result
  })
}

export const deleteProductController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const product_id = String(req.params.product_id)
  await productsService.deleteProduct(user_id, product_id)
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCTS_MESSAGES.DELETE_PRODUCT_SUCCESS
  })
}
