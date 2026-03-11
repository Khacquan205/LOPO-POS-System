import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation.js'
import { STORES_MESSAGES } from '~/constants/messages.js'

export const generateStoreQrValidator = validate(checkSchema({}, ['body']))

export const joinByQrValidator = validate(
  checkSchema(
    {
      qr_code: {
        notEmpty: { errorMessage: STORES_MESSAGES.QR_CODE_IS_REQUIRED },
        isString: { errorMessage: STORES_MESSAGES.QR_CODE_MUST_BE_STRING },
        trim: true
      }
    },
    ['body']
  )
)

export const reviewJoinRequestValidator = validate(
  checkSchema(
    {
      request_id: {
        in: ['params'],
        notEmpty: { errorMessage: STORES_MESSAGES.REQUEST_ID_MUST_BE_MONGO_ID },
        isMongoId: { errorMessage: STORES_MESSAGES.REQUEST_ID_MUST_BE_MONGO_ID }
      }
    },
    ['params']
  )
)

export const createStoreValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: STORES_MESSAGES.STORE_NAME_IS_REQUIRED },
        isString: { errorMessage: STORES_MESSAGES.STORE_NAME_MUST_BE_STRING },
        trim: true
      }
    },
    ['body']
  )
)

export const selectStoreValidator = validate(
  checkSchema(
    {
      store_id: {
        notEmpty: { errorMessage: STORES_MESSAGES.STORE_ID_IS_REQUIRED },
        isMongoId: { errorMessage: STORES_MESSAGES.STORE_ID_MUST_BE_MONGO_ID }
      }
    },
    ['body']
  )
)
