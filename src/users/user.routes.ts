import { Router } from 'express'

import { isAuthenticated, isAdmin } from '../config/passport'
import { getUser, toggleAdmin } from './user.service'

const router = Router()

router.get('/:id', isAuthenticated, getUser, (req, res) =>
  res.render('user/show', {
    userToShow: req.userToShow,
    user: req.user
  })
)
router.post('/:id/admin', isAdmin, toggleAdmin, (req, res) =>
  res.redirect(`/users/${req.params.id}`)
)

export default router
