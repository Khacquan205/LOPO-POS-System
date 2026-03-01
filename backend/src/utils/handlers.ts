import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler =
  (func: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Promise.resolve(func(req, res, next))
    } catch (error) {
      next(error)
    }
  }
