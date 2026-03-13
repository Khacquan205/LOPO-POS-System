import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares.js'
import {
  approveJoinRequestController,
  createStoreController,
  generateStoreQrController,
  getMyStoresController,
  getPendingJoinRequestsController,
  rejectJoinRequestController,
  requestJoinStoreByQrController,
  selectStoreController
} from '~/controllers/stores.controllers.js'
import {
  createStoreValidator,
  generateStoreQrValidator,
  joinByQrValidator,
  reviewJoinRequestValidator,
  selectStoreValidator
} from '~/middlewares/stores.middlewares.js'
import { ownerOnlyValidator } from '~/middlewares/users.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const storesRouter = Router()

storesRouter.post(
  '/qr-code',
  accessTokenValidator,
  generateStoreQrValidator,
  wrapRequestHandler(generateStoreQrController)
)
storesRouter.post(
  '/join-by-qr',
  accessTokenValidator,
  joinByQrValidator,
  wrapRequestHandler(requestJoinStoreByQrController)
)
storesRouter.get('/join-requests/pending', accessTokenValidator, wrapRequestHandler(getPendingJoinRequestsController))
storesRouter.post(
  '/join-requests/:request_id/approve',
  accessTokenValidator,
  reviewJoinRequestValidator,
  wrapRequestHandler(approveJoinRequestController)
)
storesRouter.post(
  '/join-requests/:request_id/reject',
  accessTokenValidator,
  reviewJoinRequestValidator,
  wrapRequestHandler(rejectJoinRequestController)
)

// Owner: tạo cửa hàng/chi nhánh mới
storesRouter.post(
  '/',
  accessTokenValidator,
  ownerOnlyValidator,
  createStoreValidator,
  wrapRequestHandler(createStoreController)
)
// Multi-store: list stores user has access to
storesRouter.get('/my-stores', accessTokenValidator, wrapRequestHandler(getMyStoresController))
// Multi-store: switch active store
storesRouter.post('/select', accessTokenValidator, selectStoreValidator, wrapRequestHandler(selectStoreController))

export default storesRouter
