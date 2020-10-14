import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import passport from 'passport'
import { Strategy } from 'passport-oauth2'

import { RoleType, User } from '../components/users/user'
import { createUser } from '../components/users/user.service'

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
      _profile: {},
      done: (err: Error, user: User) => void
    ) => {
      const responseUser = await fetch(
        `${AUTH_SCH_URL}/api/profile?access_token=${accessToken}`
      ).then(res => res.json())

      const user = await User.query().findOne({ authSchId: responseUser.internal_id })

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
  const user = await User.query().findOne({ id })
  done(null, user)
})

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type']

  if (req.isAuthenticated()) {
    next()
  } else {
    if ((contentType &&
      (contentType.indexOf('application/json') !== 0 ||
       contentType.indexOf('multipart/form-data') !== 0)) ||
       req.method !== 'GET') {
      return res.sendStatus(401)
    }
    res.render('error/not-authenticated')
  }
}

/**
 * Authorization Required middleware.
 */
export const requireRoles = (...roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req.user as User)?.role
    if (roles.some((element) => role == element)) {
      next()
    } else {
      if (req.method !== 'GET') {
        return res.sendStatus(403)
      }
      res.render('error/forbidden')
    }
  }
}
