import { Router } from 'express'

import { getGroupsForRoom, index, show } from '../controllers/room'

const router = Router()

router.get('/', index)
router.get('/:id', show)
router.get('/:id/events', getGroupsForRoom)

export default router
