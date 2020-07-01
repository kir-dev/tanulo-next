import { Router } from 'express'
import { check } from 'express-validator'

import { isAdmin, isAuthenticated } from '../../config/passport'
import { handleValidationError } from '../../util/errorHandlers'
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
  check('floor')
    .optional({ nullable: true })
    .isInt({ gt: 2, lt: 19 })
    .withMessage('A szint csak üres vagy 3 és 18 közötti szám lehet'),
  handleValidationError(400),
  updateUser,
  (req, res) => res.json(req.user)
)

export default router
