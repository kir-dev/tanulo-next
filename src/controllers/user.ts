import { Request, Response } from 'express'
import '../config/passport'

/**
 * GET /login
 * Login page.
 */
export const getLogin = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect('/')
  }
  res.render('account/login', {
    title: 'Login'
  })
}


/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}

/**
 * GET /account
 * Profile page.
 */
export const getAccount = (req: Request, res: Response) => {
  res.render('account/profile', {
    title: 'Account Management'
  })
}

