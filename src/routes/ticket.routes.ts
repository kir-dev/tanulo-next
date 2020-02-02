import { Router } from 'express'

const router = Router()

import { isAdmin, isAuthenticated } from '../config/passport'
import { create, createForm, destroy, index } from '../controllers/ticket'

router.get('/', isAuthenticated, index)
router.get('/new', isAuthenticated, createForm)
router.post('/new', isAuthenticated, create)
router.post('/:id/delete', isAdmin, destroy)

export default router
