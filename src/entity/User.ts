import {
  BaseEntity,
  Column,
  Entity,
  getConnection,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Group } from './Group'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  authSchId: string

  @Column()
  admin: boolean

  @ManyToMany(() => Group, group => group.users)
  groups: Group[]

  @OneToMany(() => Group, group => group.owner)
  ownedGroups: Group[]

  static async toggleAdmin(id: number) {
    const user = await User.findOne({ id })
    if (user) {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ admin: !user.admin })
        .where('id = :id', { id })
        .execute()
      return true
    } else {
      return false
    }
  }
}
