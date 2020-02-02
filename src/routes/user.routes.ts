import { Router } from 'express'

import * as passportConfig from '../config/passport'
import * as userController from '../controllers/user'

const router = Router()

router.get('/me', passportConfig.isAuthenticated, userController.showMe)
router.get('/:id', passportConfig.isAuthenticated, userController.show)
router.post('/:id/admin', passportConfig.isAdmin, userController.toggleAdmin)

export default router
