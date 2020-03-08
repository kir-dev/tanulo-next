import { Router } from 'express'

import { isAuthenticated, isAdmin } from '../config/passport'
import { show, showMe, toggleAdmin } from '../controllers/user'

const router = Router()

router.get('/me', isAuthenticated, showMe)
router.get('/:id', isAuthenticated, show)
router.post('/:id/admin', isAdmin, toggleAdmin)

export default router
