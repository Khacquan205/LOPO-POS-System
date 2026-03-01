import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages.js'
import { validate } from '~/utils/validation.js'
import usersService from '~/services/users.services.js'
import { verifyToken } from '~/utils/jwt.js'
import { envConfig } from '~/config/index.js'
import { TokenType } from '~/constants/enum.js'
import { ErrorWithStatus } from './error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

const registerFieldsSchema = {
  full_name: {
    notEmpty: { errorMessage: USERS_MESSAGES.FULL_NAME_IS_REQUIRED },
    isString: { errorMessage: USERS_MESSAGES.FULL_NAME_MUST_BE_STRING },
    trim: true
  },
  phone_number: {
    notEmpty: { errorMessage: USERS_MESSAGES.PHONE_NUMBER_IS_REQUIRED },
    matches: {
      options: /^(0[3|5|7|8|9])+([0-9]{8})$/,
      errorMessage: USERS_MESSAGES.PHONE_NUMBER_IS_INVALID
    },
    custom: {
      options: async (value: string) => {
        const exists = await usersService.checkPhoneNumberExists(value)
        if (exists) {
          throw new Error(USERS_MESSAGES.PHONE_NUMBER_ALREADY_EXISTS)
        }
        return true
      }
    }
  },
  password: {
    notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
    isLength: {
      options: { min: 6, max: 50 },
      errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
    }
  },
  confirm_password: {
    notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
    custom: {
      options: (value: string, meta: any) => {
        const req = meta.req
        if (value !== req.body.password) {
          throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME)
        }
        return true
      }
    }
  }
}

export const registerOwnerValidator = validate(
  checkSchema(
    {
      store_name: {
        notEmpty: { errorMessage: USERS_MESSAGES.STORE_NAME_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.STORE_NAME_MUST_BE_STRING },
        trim: true
      },
      ...registerFieldsSchema
    },
    ['body']
  )
)

export const registerStaffValidator = validate(
  checkSchema(
    {
      ...registerFieldsSchema
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      phone_number: {
        notEmpty: { errorMessage: USERS_MESSAGES.PHONE_NUMBER_IS_REQUIRED },
        matches: {
          options: /^(0[3|5|7|8|9])+([0-9]{8})$/,
          errorMessage: USERS_MESSAGES.PHONE_NUMBER_IS_INVALID
        }
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        in: ['headers'],
        notEmpty: {
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const access_token = String(value).replace('Bearer ', '')
            if (!access_token) {
              throw new Error(USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED)
            }
            const decoded_authorization = await verifyToken({
              token: access_token,
              secretOrPublicKey: envConfig.jwt.accessSecret
            })
            if (decoded_authorization.token_type !== TokenType.AccessToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.decoded_authorization = decoded_authorization
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        in: ['body'],
        notEmpty: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value) => {
            const decoded_refresh_token = await verifyToken({
              token: String(value),
              secretOrPublicKey: envConfig.jwt.refreshSecret
            })
            if (decoded_refresh_token.token_type !== TokenType.RefreshToken) {
              throw new Error(USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
