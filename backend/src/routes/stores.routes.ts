import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares.js'
import {
  approveJoinRequestController,
  generateStoreQrController,
  getPendingJoinRequestsController,
  rejectJoinRequestController,
  requestJoinStoreByQrController
} from '~/controllers/stores.controllers.js'
import {
  generateStoreQrValidator,
  joinByQrValidator,
  reviewJoinRequestValidator
} from '~/middlewares/stores.middlewares.js'
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

export default storesRouter
