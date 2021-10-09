import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void

export interface ValidationError {
  msg: string
}

export function handleValidationError(statusCode: number): ExpressMiddleware {
  return function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(statusCode).json({ errors: errors.array() })
    }
    next()
  }
}

export function checkIdParam(req: Request, res: Response, next: NextFunction): void {
  if (isNaN(parseInt(req.params.id))) {
    res.status(404).render('error/not-found')
  } else {
    next()
  }
}
