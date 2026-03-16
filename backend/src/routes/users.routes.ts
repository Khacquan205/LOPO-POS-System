import { Router } from 'express'
import {
  loginController,
  logoutController,
  meController,
  refreshTokenController,
  registerStaffPublicController,
  registerStaffController,
  registerController,
  getStaffsController,
  updateStaffStatusController,
  updateStoreNameController,
  deleteStoreController,
  deleteStaffController
} from '~/controllers/user.controllers.js'
import {
  accessTokenValidator,
  loginValidator,
  ownerOnlyValidator,
  registerOwnerValidator,
  registerStaffValidator,
  refreshTokenValidator,
  updateStaffStatusValidator,
  storeIdParamValidator,
  staffIdParamValidator,
  updateStoreNameValidator
} from '~/middlewares/users.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const usersRouter = Router()

usersRouter.post('/register-owner', registerOwnerValidator, wrapRequestHandler(registerController))
usersRouter.post('/register-staff', registerStaffValidator, wrapRequestHandler(registerStaffPublicController))

// New owner-only route (shown in Swagger)
usersRouter.post('/owner/staff', accessTokenValidator, ownerOnlyValidator, registerStaffValidator, wrapRequestHandler(registerStaffController))
// Keep old route as alias to avoid breaking existing clients
usersRouter.post('/staff', accessTokenValidator, ownerOnlyValidator, registerStaffValidator, wrapRequestHandler(registerStaffController))

usersRouter.get('/owner/staff-list', accessTokenValidator, ownerOnlyValidator, wrapRequestHandler(getStaffsController))
usersRouter.patch('/owner/staff/:staff_id/status', accessTokenValidator, ownerOnlyValidator, updateStaffStatusValidator, wrapRequestHandler(updateStaffStatusController))
usersRouter.delete('/owner/staff/:staff_id', accessTokenValidator, ownerOnlyValidator, staffIdParamValidator, wrapRequestHandler(deleteStaffController))
usersRouter.patch(
  '/owner/stores/:store_id',
  accessTokenValidator,
  ownerOnlyValidator,
  storeIdParamValidator,
  updateStoreNameValidator,
  wrapRequestHandler(updateStoreNameController)
)
usersRouter.delete(
  '/owner/stores/:store_id',
  accessTokenValidator,
  ownerOnlyValidator,
  storeIdParamValidator,
  wrapRequestHandler(deleteStoreController)
)

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(meController))

export default usersRouter
