import { Router } from 'express'
import { getStocksController, getStockController, updateStockController } from '~/controllers/inventory.controllers.js'
import { accessTokenValidator } from '~/middlewares/users.middlewares.js'
import { updateStockValidator } from '~/middlewares/inventory.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const inventoryRouter = Router()

// Lấy toàn bộ tồn kho của cửa hàng
inventoryRouter.get('/', accessTokenValidator, wrapRequestHandler(getStocksController))

// Lấy tồn kho theo sản phẩm
inventoryRouter.get('/:product_id', accessTokenValidator, wrapRequestHandler(getStockController))

// Cập nhật số lượng tồn kho
inventoryRouter.put(
  '/:product_id',
  accessTokenValidator,
  updateStockValidator,
  wrapRequestHandler(updateStockController)
)

export default inventoryRouter
