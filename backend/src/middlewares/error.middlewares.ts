import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus.js'

export class ErrorWithStatus {
  message: string
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export const defaultErrorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({ message: err.message })
  }

  if (err instanceof Error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Unknown server error' })
}
