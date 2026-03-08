import { Request, Response } from 'express'
import inventoryService from '~/services/inventory.services.js'
import { INVENTORY_MESSAGES } from '~/constants/messages.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const getStocksController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const result = await inventoryService.getStocks(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: INVENTORY_MESSAGES.GET_STOCKS_SUCCESS,
    result
  })
}

export const getStockController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const product_id = String(req.params.product_id)
  const result = await inventoryService.getStock(user_id, product_id)
  return res.status(HTTP_STATUS.OK).json({
    message: INVENTORY_MESSAGES.GET_STOCK_SUCCESS,
    result
  })
}

export const updateStockController = async (req: Request, res: Response) => {
  const user_id = String(req.decoded_authorization?.user_id)
  const product_id = String(req.params.product_id)
  const { on_hand } = req.body as { on_hand: number }
  const result = await inventoryService.updateStock(user_id, product_id, Number(on_hand))
  return res.status(HTTP_STATUS.OK).json({
    message: INVENTORY_MESSAGES.UPDATE_STOCK_SUCCESS,
    result
  })
}
