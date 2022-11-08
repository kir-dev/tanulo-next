import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import Knex from 'knex'
import lusca from 'lusca'
import { Model } from 'objection'
import path from 'path'
import passport from 'passport'
import RateLimit from 'express-rate-limit'

import dbConfig = require('../knexfile')
import { SESSION_SECRET } from './util/secrets'

import userRouter from './components/users/user.routes'
import ticketRouter from './components/tickets/ticket.routes'
import roomRouter, { index } from './components/rooms/room.routes'
import groupRouter from './components/groups/group.routes'

const knex = Knex(dbConfig)

Model.knex(knex)

// Create Express server
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'pug')
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: { maxAge: 7 * 1000 * 60 * 60 * 24 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// set up rate limiter: maximum requests per minute
const limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 1000            // max number of requests
})
// apply rate limiter to all requests
app.use(limiter)

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use((req, _res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./) &&
    !req.path.match(/^\/rooms\/\d+\/events$/)) {

    req.session.returnTo = req.path
  }
  next()
})

app.use((req, _res, next) => {
  const theme = req.cookies.theme || 'light'
  app.locals.theme = theme
  next()
})

app.use(
  express.static(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 })
)

/**
 * Primary app routes.
 */
app.get('^/$', index)
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.use('/users', userRouter)

app.use('/groups', groupRouter)

app.use('/rooms', roomRouter)

app.use('/tickets', ticketRouter)

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/oauth', passport.authenticate('oauth2'))
app.get('/auth/oauth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  (req, res) => res.redirect(req.session.returnTo || '/')
)

/**
 * Error routes
 */
app.use('*', (req, res) => res.render('error/not-found'))

export default app
