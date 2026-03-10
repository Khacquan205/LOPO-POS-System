import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation.js'
import { INVENTORY_MESSAGES } from '~/constants/messages.js'

export const updateStockValidator = validate(
  checkSchema(
    {
      on_hand: {
        notEmpty: { errorMessage: INVENTORY_MESSAGES.ON_HAND_IS_REQUIRED },
        isInt: { options: { min: 0 }, errorMessage: INVENTORY_MESSAGES.ON_HAND_MUST_BE_NON_NEGATIVE_INT }
      }
    },
    ['body']
  )
)
