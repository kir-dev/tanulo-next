import passport from 'passport'
import { Strategy } from 'passport-oauth2'
import request from 'request-promise'

import { User } from '../entity/User'
import { Request, Response, NextFunction } from 'express'

const AUTH_SCH_URL = 'https://auth.sch.bme.hu'

passport.serializeUser((user: User, done) => {
  done(undefined, user.id)
})

passport.deserializeUser(async (id: number, done) => {
  const user = await User.findOne(id)
  done(null, user)
})

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
      const response = await request(`${AUTH_SCH_URL}/api/profile?access_token=${accessToken}`)
      const responseUser = await JSON.parse(response)

      const user = await User.findOne({ authSchId: responseUser.internal_id})
      if (user) {
        done(null, user)
      } else {
        const newUser = User.create()
        newUser.name = responseUser.displayName
        newUser.authSchId = responseUser.internal_id
        newUser.email = responseUser.mail
        newUser.admin = false
        await newUser.save()
        done(null, newUser)
      }
    }
  )
)

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

/**
 * Authorization Required middleware.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User

  if (user.admin) {
    next()
  } else {
    res.redirect('/')
  }
}
