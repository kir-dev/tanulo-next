import { Router } from 'express'
import { check } from 'express-validator'

import { isAuthenticated } from '../../config/passport'
import { handleValidationError } from '../../util/validators'
import { addFavorite, removeFavorite } from './favorite.service'

const router = Router()

router.post('/',
  isAuthenticated,
  check('room')
    .notEmpty()
    .isInt({ gt: 2, lt: 19 })
    .withMessage('A szint csak üres vagy 3 és 18 közötti szám lehet'),
  handleValidationError(400),
  addFavorite,
  (req, res) => res.sendStatus(201)
)

router.delete('/:id',
  isAuthenticated,
  removeFavorite,
  (req, res) => res.sendStatus(201)
)

export default router
