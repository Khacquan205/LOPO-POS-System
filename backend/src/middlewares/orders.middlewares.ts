import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation.js'
import { ORDERS_MESSAGES } from '~/constants/messages.js'
import { PaymentMethod, PaymentStatus } from '~/constants/enum.js'

export const createOrderValidator = validate(
  checkSchema(
    {
      items: {
        notEmpty: { errorMessage: ORDERS_MESSAGES.ITEMS_IS_REQUIRED },
        isArray: { options: { min: 1 }, errorMessage: ORDERS_MESSAGES.ITEMS_MUST_BE_ARRAY }
      },
      'items.*.product_id': {
        notEmpty: { errorMessage: ORDERS_MESSAGES.ORDER_ITEM_PRODUCT_ID_REQUIRED },
        isMongoId: { errorMessage: ORDERS_MESSAGES.ORDER_ITEM_PRODUCT_ID_MUST_BE_MONGO_ID }
      },
      'items.*.quantity': {
        isInt: { options: { min: 1 }, errorMessage: ORDERS_MESSAGES.ORDER_ITEM_QUANTITY_MUST_BE_POSITIVE_INT }
      },
      note: {
        optional: true,
        isString: { errorMessage: ORDERS_MESSAGES.NOTE_MUST_BE_STRING },
        trim: true
      },
      payment_method: {
        optional: true,
        isIn: { options: [Object.values(PaymentMethod)], errorMessage: ORDERS_MESSAGES.PAYMENT_METHOD_IS_INVALID }
      },
      payment_status: {
        optional: true,
        isIn: { options: [Object.values(PaymentStatus)], errorMessage: ORDERS_MESSAGES.PAYMENT_STATUS_IS_INVALID }
      }
    },
    ['body']
  )
)
