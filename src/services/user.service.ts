import { FindOneOptions } from 'typeorm'

import { User } from '../entity/User'

interface OAuthUser {
  displayName: string
  internal_id: string
  mail: string
}

export const getUser = async (options: FindOneOptions) => {
  return await User.findOne(options)
}

export const createUser = async (user: OAuthUser) => {
  const newUser = User.create()
  newUser.name = user.displayName
  newUser.authSchId = user.internal_id
  newUser.email = user.mail
  newUser.admin = false
  return await newUser.save()
}
