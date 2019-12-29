import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany, getConnection } from 'typeorm'
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
    const admin = (await User.findOne({ id })).admin
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ admin: !admin })
      .where('id = :id', { id })
      .execute()
  }
}
