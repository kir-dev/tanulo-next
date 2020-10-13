import { Router } from 'express'
import { check } from 'express-validator'
import { ROLES } from '../../util/constants'

import { isAdmin, isAuthenticated } from '../../config/passport'
import { handleValidationError, checkIdParam } from '../../util/validators'
import { RoleType, User } from './user'
import { isSameUser } from './user.middlewares'
import { getUser, updateRole, updateUser } from './user.service'

const router = Router()

router.get('/:id', isAuthenticated, checkIdParam, getUser, (req, res) =>
  res.render('user/show', {
    userToShow: req.userToShow,
    ROLES: ROLES
  })
)

router.patch('/:id/role',
  isAdmin,
  check('role')
    .isString()
    .custom((input) => { 
      return [RoleType.ADMIN, RoleType.TICKET_ADMIN, RoleType.USER]
        .some((element) => element == input)
    })
    .withMessage('Nem megfelelő role!'),
  handleValidationError(400),
  updateRole,
  (req, res) => res.sendStatus(201)
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
  isSameUser,
  updateUser,
  (req, res) => res.json(req.user)
)

export default router
