import { Request, Response, NextFunction } from 'express'
import { validationResult, type ValidationChain } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus.js'

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      message: 'Validation error',
      errors: errors.array()
    })
  }
}
