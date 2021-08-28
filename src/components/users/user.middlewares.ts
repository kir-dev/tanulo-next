import { Request, Response, NextFunction } from 'express'

export const isSameUser = (req: Request, res: Response, next: NextFunction): void => {
  if (parseInt(req.params.id) !== req.user.id) {
    res.status(400).json({ errors: [{ msg: 'Nem találahtó felhasználó a megadott ID-val' }] })
  } else {
    next()
  }
}
