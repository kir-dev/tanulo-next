import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import passport from 'passport'
import { Strategy } from 'passport-oauth2'

import { User } from '../entity/User'
import { createUser, getUser } from '../services/user.service'

const AUTH_SCH_URL = 'https://auth.sch.bme.hu'

/**
 * Sign in with AuthSCH.
 */
passport.use(
  new Strategy(
    {
      authorizationURL: `${AUTH_SCH_URL}/site/login`,
      tokenURL: `${AUTH_SCH_URL}/oauth2/token`,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/oauth/callback',
      scope: ['basic', 'displayName', 'mail']
    },
    async (
      accessToken: string,
      _refreshToken: string,
      _profile: any,
      done: (err: Error, user: User) => void
    ) => {
      const responseUser = await fetch(
        `${AUTH_SCH_URL}/api/profile?access_token=${accessToken}`
      ).then(res => res.json())

      const user = await getUser({ where: { authSchId: responseUser.internal_id } })
      if (user) {
        done(null, user)
      } else {
        const newUser = await createUser(responseUser)
        done(null, newUser)
      }
    }
  )
)

passport.serializeUser((user: User, done) => {
  done(undefined, user.id)
})

passport.deserializeUser(async (id: number, done) => {
  const user = await getUser({ where: { id } })
  done(null, user)
})

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.render('error/not-authenticated')
}

/**
 * Authorization Required middleware.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req.user as User).admin) {
    next()
  } else {
    res.render('error/forbidden')
  }
}
