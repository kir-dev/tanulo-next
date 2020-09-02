import { Request, Response, NextFunction } from 'express'

import { asyncWrapper } from '../../util/asyncWrapper'
import { User } from '../users/user'
import { Favorite } from './favorite'

export const addFavorite = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const favorites = await User.relatedQuery('favorites')
    .for((req.user as User).id)
  if (
    favorites &&
    !favorites.some(element => element.room == parseInt(req.params.id))
  ) {
    await User.relatedQuery('favorites')
      .for((req.user as User).id)
      .insert({
        room: parseInt(req.body.room)
      })
    next()
  } else { 
    res.sendStatus(404)
  }
})
  
export const removeFavorite = asyncWrapper(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const favorites = await User.relatedQuery('favorites').for((req.user as User).id)
    if (
      req.params.id &&
      favorites &&
      favorites.findIndex(element => element.room == parseInt(req.params.id)) >= 0
    ) {
      await User.relatedQuery('favorites')
        .for((req.user as User).id)
        .delete()
        .where({ room: parseInt(req.params.id) })
      next()
    }
    else {
      res.sendStatus(404)
    }
  })
