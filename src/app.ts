import 'reflect-metadata'
import express from 'express'
import compression from 'compression'  // compresses requests
import session from 'express-session'
import bodyParser from 'body-parser'
import Knex from 'knex'
import lusca from 'lusca'
import flash from 'express-flash'
import { Model } from 'objection'
import path from 'path'
import passport from 'passport'

import dbConfig = require('../knexfile')
import { SESSION_SECRET } from './util/secrets'

import userRouter from './components/users/user.routes'
import ticketRouter from './components/tickets/ticket.routes'
import roomRouter from './components/rooms/room.routes'
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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use((req, _res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path
  } else if (req.user &&
    req.path == '/users/me') {
    req.session.returnTo = req.path
  }
  next()
})

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
)

/**
 * Primary app routes.
 */
app.get('^/$', (_req, res) => res.redirect('/rooms'))
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
