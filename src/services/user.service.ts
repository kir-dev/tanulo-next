import { FindOneOptions } from 'typeorm'

import { User } from '../entity/user.entity'

interface OAuthUser {
  displayName: string
  internal_id: string
  mail: string
}

export const getUser = async (options: FindOneOptions): Promise<User> => {
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
