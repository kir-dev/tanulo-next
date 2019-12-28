import 'reflect-metadata'
import express from 'express'
import compression from 'compression'  // compresses requests
import session from 'express-session'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import flash from 'express-flash'
import path from 'path'
import passport from 'passport'
import { SESSION_SECRET } from './util/secrets'

// Controllers (route handlers)
import * as homeController from './controllers/home'
import * as userController from './controllers/user'
import * as groupController from './controllers/group'

// API keys and Passport configuration
import * as passportConfig from './config/passport'

// Create Express server
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: { maxAge: 60000 }
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
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path
  } else if (req.user &&
    req.path == '/account') {
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
app.get('/', homeController.index)
app.get('/account', passportConfig.isAuthenticated, userController.getAccount)

/**
 * Groups routes
 */
app.get('/groups', groupController.getGroups)
app.get('/groups/new', groupController.getGroupForm)
app.post('/groups/new', passportConfig.isAuthenticated, groupController.createGroup)
app.get('/groups/:id', passportConfig.isAuthenticated, groupController.getGroup)
app.post('/groups/:id/join', passportConfig.isAuthenticated, groupController.joinGroup)
app.post('/groups/:id/leave', passportConfig.isAuthenticated, groupController.leaveGroup)

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/oauth', passport.authenticate('oauth2'))
app.get(
  '/auth/oauth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/')
  })

export default app
