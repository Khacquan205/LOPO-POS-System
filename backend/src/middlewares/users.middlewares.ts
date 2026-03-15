import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages.js'
import { validate } from '~/utils/validation.js'
import usersService from '~/services/users.services.js'
import { verifyToken } from '~/utils/jwt.js'
import { envConfig } from '~/config/index.js'
import { TokenType, UserRole, UserStatus } from '~/constants/enum.js'
import { ErrorWithStatus } from './error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'

const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,20}$/
const phoneNumberRegex = /^0\d{9}$/

const registerFieldsSchema = {
  full_name: {
    notEmpty: { errorMessage: USERS_MESSAGES.FULL_NAME_IS_REQUIRED },
    isString: { errorMessage: USERS_MESSAGES.FULL_NAME_MUST_BE_STRING },
    trim: true
  },
  phone_number: {
    notEmpty: { errorMessage: USERS_MESSAGES.PHONE_NUMBER_IS_REQUIRED },
    matches: {
      options: phoneNumberRegex,
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
    matches: {
      options: passwordStrengthRegex,
      errorMessage: USERS_MESSAGES.PASSWORD_MUST_INCLUDE_UPPER_SPECIAL_NUMBER
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

export const storeIdParamValidator = validate(
  checkSchema(
    {
      store_id: {
        in: ['params'],
        notEmpty: { errorMessage: 'store_id là bắt buộc' },
        isMongoId: { errorMessage: 'store_id không hợp lệ' }
      }
    },
    ['params']
  )
)

export const updateStoreNameValidator = validate(
  checkSchema(
    {
      name: {
        in: ['body'],
        notEmpty: { errorMessage: USERS_MESSAGES.STORE_NAME_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.STORE_NAME_MUST_BE_STRING },
        isLength: {
          options: { max: 100 },
          errorMessage: 'Tên cửa hàng không được vượt quá 100 ký tự'
        },
        trim: true
      }
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
          options: phoneNumberRegex,
          errorMessage: USERS_MESSAGES.PHONE_NUMBER_IS_INVALID
        }
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
        matches: {
          options: passwordStrengthRegex,
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_INCLUDE_UPPER_SPECIAL_NUMBER
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

export const ownerOnlyValidator = (req: Request, res: Response, next: NextFunction) => {
  if (req.decoded_authorization?.role !== UserRole.Owner) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: USERS_MESSAGES.ONLY_OWNER_CAN_DO_THIS
    })
  }
  return next()
}

export const updateStaffStatusValidator = validate(
  checkSchema(
    {
      staff_id: {
        in: ['params'],
        notEmpty: { errorMessage: 'staff_id là bắt buộc' },
        isMongoId: { errorMessage: 'staff_id không hợp lệ' }
      },
      status: {
        in: ['body'],
        notEmpty: { errorMessage: 'status là bắt buộc' },
        isIn: {
          options: [[UserStatus.Active, UserStatus.Inactive]],
          errorMessage: `status chỉ nhận 'active' hoặc 'inactive'`
        }
      }
    },
    ['params', 'body']
  )
)
