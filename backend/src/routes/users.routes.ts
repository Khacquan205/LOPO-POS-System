import { Router } from 'express'
import {
  loginController,
  logoutController,
  meController,
  refreshTokenController,
  registerStaffPublicController,
  registerStaffController,
  registerController
} from '~/controllers/user.controllers.js'
import {
  accessTokenValidator,
  loginValidator,
  registerOwnerValidator,
  registerStaffValidator,
  refreshTokenValidator
} from '~/middlewares/users.middlewares.js'
import { wrapRequestHandler } from '~/utils/handlers.js'

const usersRouter = Router()

usersRouter.post('/register-owner', registerOwnerValidator, wrapRequestHandler(registerController))
usersRouter.post('/register-staff', registerStaffValidator, wrapRequestHandler(registerStaffPublicController))
usersRouter.post('/staff', accessTokenValidator, registerStaffValidator, wrapRequestHandler(registerStaffController))
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(meController))

export default usersRouter
