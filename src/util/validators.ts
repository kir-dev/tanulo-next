import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export interface ValidationError {
  msg: string
}

export function handleValidationError(statusCode: number) {
  return function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(statusCode).json({ errors: errors.array() })
    }
    next()
  }
}

export function checkIdParam(req: Request, res: Response, next: NextFunction) {
  if (isNaN(parseInt(req.params.id))) {
    res.render('error/not-found')
  } else {
    next()
  }
}
