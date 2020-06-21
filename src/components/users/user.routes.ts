import { Router } from 'express'

import { isAuthenticated, isAdmin } from '../../config/passport'
import { User } from './user'
import { getUser, toggleAdmin, updateUser } from './user.service'

const router = Router()

router.get('/:id', isAuthenticated, getUser, (req, res) =>
  res.render('user/show', {
    userToShow: req.userToShow
  })
)

router.post('/:id/admin', isAdmin, toggleAdmin, (req, res) =>
  res.redirect(`/users/${req.params.id}`)
)

router.patch('/:id',
  isAuthenticated,
  (req, res, next) => {
    if ((req.user as User).id !== parseInt(req.params.id)) {
      return res.sendStatus(403)
    }
    next()
  },
  (req, res, next) => {
    const floor = req.body.floor
    if (!(floor == null || (floor >= 3 && floor <= 18))) {
      return res.status(400).json(
        {
          errors: [
            { msg: 'A szint csak üres vagy 3 és 18 közötti szám lehet' }
          ]
        }
      )
    }
    next()
  },
  updateUser,
  (req, res) => res.sendStatus(200)
)

export default router
