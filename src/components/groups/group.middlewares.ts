import { NextFunction, Request, Response } from 'express'
import { check } from 'express-validator'
import { writeFileSync } from 'fs'
import * as ics from 'ics'
import winston from 'winston'
import { differenceInMinutes } from 'date-fns'

import { User } from '../users/user'
import { Group } from './group'
import { asyncWrapper } from '../../util/asyncWrapper'

const getGroupAttendeeCount = async (groupId): Promise<number> => {
  // No cleaner solution was found for selecting only the count
  // ( Referring to: https://github.com/Vincit/objection.js/issues/1588 )
  return (await Group.relatedQuery('users')
    .for(groupId)
    .count({count: '*'})
  ).map(
    // ts ignore added because 'count' property must exist due to previous line
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    count => count.count
  )[0]
}

export const joinGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const group = req.group
  const userCount = await getGroupAttendeeCount(group.id)

  // Join group if not already in it, and it's not closed or it's the owner who joins.
  // We only join the group if it is not full already
  if ((!group.doNotDisturb || (user.id === group.ownerId)) &&
    !group.users?.find(it => it.id === user.id) &&
    userCount < (group.maxAttendees || 100)) {
    await Group.relatedQuery('users')
      .for(group.id)
      .relate(user.id)
  }
  next()
})
export const leaveGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  await Group.relatedQuery('users')
    .for(req.group.id)
    .unrelate()
    .where('user_id', (req.user as User).id)

  next()
})

/**
 * @deprecated use isGroupOwnerOrAdmin instead 
 */
export const isGroupOwner = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req.user as User)?.id === req.group.ownerId) {
      next()
    } else {
      res.render('error/forbidden')
    }
  }
)

export const isGroupOwnerOrAdmin = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (((req.user as User)?.id === req.group.ownerId) || ((req.user as User)?.admin)) {
      next()
    } else {
      res.render('error/forbidden')
    }
  }
)

export const createICSEvent = (req: Request, res: Response) => {
  const group = req.group
  const { startDate, endDate } = group

  const event: ics.EventAttributes = {
    title: group.name,
    description: group.description,
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes()
    ],
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    ],
    location: `SCH ${group.room.toString()}. emeleti tanuló`,
    url: `https://tanulo.sch.bme.hu/groups/${group.id}`,
    categories: group.tags ? group.tags.split(',') : null
  }

  ics.createEvent(event, (err, value) => {
    if (err) {
      winston.error(err.message)
      return res.status(500).send({ message: err.message })
    }
    const path = '/tmp/event.ics'

    try {
      writeFileSync(path, value)
      res.download(path)
    } catch (error) {
      winston.error(error.message)
      res.sendStatus(500)
    }
  })
}

export const validateGroup = () => {
  return [
    check('name', 'A csoport neve max 100 karakter hosszú nem üres szöveg lehet')
      .isString()
      .exists({ checkNull: true, checkFalsy: true })
      .notEmpty()
      .trim()
      .isLength({ max: 100 }),
    check('tags')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .custom((value: string) => value.split(',').length <= 8)
      .withMessage('Max 8 címke adható hozzá')
      .custom((value: string) => value.split(',').every(it => it.length <= 30))
      .withMessage('A címkék egyenként max 30 karakter hosszúak lehetnek'),
    check('room')
      .exists({ checkNull: true })
      .withMessage('A szint nem lehet üres')
      .isInt({ gt: 2, lt: 19 })
      .withMessage('A szint csak 3 és 18 közötti értéket vehet fel'),
    check('startDate')
      .exists({ checkNull: true, checkFalsy: true })
      .isAfter()
      .withMessage('Múltbéli kezdéssel csoport nem hozható létre')
      .custom((value, { req }) => new Date(value).getTime() < new Date(req.body.endDate).getTime())
      .withMessage('A kezdés nem lehet korábban, mint a befejezés')
      .custom((value, { req }) =>
        differenceInMinutes(new Date(req.body.endDate), new Date(value)) <= 5*60)
      .withMessage('A foglalás időtartama nem lehet hosszabb 5 óránál'),
    check('endDate', 'A befejezés időpontja kötelező')
      .exists({ checkFalsy: true, checkNull: true }),
    check('description', 'A leírás max 500 karakter lehet')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: 500 }),
    check('maxAttendees', 'Legalább 1, maximum 100 fő vehet részt!')
      .optional({ checkFalsy: true })
      .isInt({ min: 1, max: 100 })
  ]
}

export const checkValidMaxAttendeeLimit = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (await getGroupAttendeeCount(req.params.id) > (req.body.maxAttendees || 100)) {
      res.status(400).json(
        {
          errors: [{msg: 'Nem lehet kisebb a maximum jelenlét, mint a jelenlegi'}]
        }
      )
    } else {
      next()
    }
  }
)

export const checkConflicts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const group = req.body as Group
    group.startDate = new Date(req.body.startDate)
    group.endDate = new Date(req.body.endDate)
    const conflictingGroups = await Group.query()
      .where({ room: group.room })
      .andWhere(builder => {
        builder
          .where(bld => {
            bld
              .where('startDate', '<', group.endDate)
              .andWhere('endDate', '>=', group.endDate)
          })
          .orWhere(bld => {
            bld
              .where('endDate', '>', group.startDate)
              .andWhere('endDate', '<=', group.endDate)
          })
      })
      .andWhereNot({ id: req.params.id ?? null })

    if (conflictingGroups.length) {
      res.status(400).json(
        {
          errors: conflictingGroups.map(group =>
            ({ msg: `Az időpont ütközik a(z) ${group.name} csoporttal` }))
        }
      )
    } else {
      next()
    }
  }
)
