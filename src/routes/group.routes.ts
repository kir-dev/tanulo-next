import { Router } from 'express'

import { isAuthenticated } from '../config/passport'
import { create, createForm, destroy, index, join, leave, show } from '../controllers/group'
import { isGroupOwner } from '../middlewares/group.middleware'

const router = Router()

router.get('/', isAuthenticated, index)
router.get('/new', isAuthenticated, createForm)
router.post('/new', isAuthenticated, create)
router.get('/:id', isAuthenticated, show)
router.post('/:id/join', isAuthenticated, join)
router.post('/:id/leave', isAuthenticated, leave)
router.post('/:id/delete', isAuthenticated, isGroupOwner, destroy)

export default router
