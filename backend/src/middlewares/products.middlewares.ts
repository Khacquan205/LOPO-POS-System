import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation.js'
import { PRODUCTS_MESSAGES } from '~/constants/messages.js'

export const createProductValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: PRODUCTS_MESSAGES.NAME_IS_REQUIRED },
        isString: { errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_STRING },
        trim: true,
        isLength: { options: { max: 200 }, errorMessage: PRODUCTS_MESSAGES.NAME_TOO_LONG }
      },
      price: {
        notEmpty: { errorMessage: PRODUCTS_MESSAGES.PRICE_IS_REQUIRED },
        isFloat: { options: { min: 0 }, errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_NON_NEGATIVE }
      },
      category_id: {
        optional: { options: { nullable: true } },
        isMongoId: { errorMessage: PRODUCTS_MESSAGES.CATEGORY_ID_MUST_BE_MONGO_ID }
      },
      barcode: {
        optional: true,
        isString: { errorMessage: PRODUCTS_MESSAGES.BARCODE_MUST_BE_STRING },
        trim: true
      },
      image_url: {
        optional: true,
        isURL: { errorMessage: PRODUCTS_MESSAGES.IMAGE_URL_MUST_BE_URL }
      },
      track_inventory: {
        optional: true,
        isBoolean: { errorMessage: PRODUCTS_MESSAGES.TRACK_INVENTORY_MUST_BE_BOOLEAN }
      },
      is_active: {
        optional: true,
        isBoolean: { errorMessage: PRODUCTS_MESSAGES.IS_ACTIVE_MUST_BE_BOOLEAN }
      }
    },
    ['body']
  )
)

export const updateProductValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        notEmpty: { errorMessage: PRODUCTS_MESSAGES.NAME_IS_REQUIRED },
        isString: { errorMessage: PRODUCTS_MESSAGES.NAME_MUST_BE_STRING },
        trim: true,
        isLength: { options: { max: 200 }, errorMessage: PRODUCTS_MESSAGES.NAME_TOO_LONG }
      },
      price: {
        optional: true,
        isFloat: { options: { min: 0 }, errorMessage: PRODUCTS_MESSAGES.PRICE_MUST_BE_NON_NEGATIVE }
      },
      category_id: {
        optional: { options: { nullable: true } },
        isMongoId: { errorMessage: PRODUCTS_MESSAGES.CATEGORY_ID_MUST_BE_MONGO_ID }
      },
      barcode: {
        optional: true,
        isString: { errorMessage: PRODUCTS_MESSAGES.BARCODE_MUST_BE_STRING },
        trim: true
      },
      image_url: {
        optional: true,
        isURL: { errorMessage: PRODUCTS_MESSAGES.IMAGE_URL_MUST_BE_URL }
      },
      track_inventory: {
        optional: true,
        isBoolean: { errorMessage: PRODUCTS_MESSAGES.TRACK_INVENTORY_MUST_BE_BOOLEAN }
      },
      is_active: {
        optional: true,
        isBoolean: { errorMessage: PRODUCTS_MESSAGES.IS_ACTIVE_MUST_BE_BOOLEAN }
      }
    },
    ['body']
  )
)
