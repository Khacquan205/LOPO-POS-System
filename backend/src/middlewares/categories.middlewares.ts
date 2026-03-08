import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation.js'
import { CATEGORIES_MESSAGES } from '~/constants/messages.js'

export const createCategoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: CATEGORIES_MESSAGES.NAME_IS_REQUIRED },
        isString: { errorMessage: CATEGORIES_MESSAGES.NAME_MUST_BE_STRING },
        trim: true,
        isLength: { options: { max: 100 }, errorMessage: CATEGORIES_MESSAGES.NAME_TOO_LONG }
      },
      is_active: {
        optional: true,
        isBoolean: { errorMessage: CATEGORIES_MESSAGES.IS_ACTIVE_MUST_BE_BOOLEAN }
      }
    },
    ['body']
  )
)

export const updateCategoryValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        notEmpty: { errorMessage: CATEGORIES_MESSAGES.NAME_IS_REQUIRED },
        isString: { errorMessage: CATEGORIES_MESSAGES.NAME_MUST_BE_STRING },
        trim: true,
        isLength: { options: { max: 100 }, errorMessage: CATEGORIES_MESSAGES.NAME_TOO_LONG }
      },
      is_active: {
        optional: true,
        isBoolean: { errorMessage: CATEGORIES_MESSAGES.IS_ACTIVE_MUST_BE_BOOLEAN }
      }
    },
    ['body']
  )
)
