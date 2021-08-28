import { Request, Response, NextFunction } from 'express'

import { User } from './user'

export const isSameUser = (req: Request, res: Response, next: NextFunction): void => {
  if (parseInt(req.params.id) !== (req.user as User).id) {
    res.status(400).json({ errors: [{ msg: 'Nem találahtó felhasználó a megadott ID-val' }] })
  } else {
    next()
  }
}
