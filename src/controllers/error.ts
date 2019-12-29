import { Request, Response } from 'express'

export const notFound = (req: Request, res: Response) => {
  res.render('error/not-found')
}
