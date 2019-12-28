import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany } from 'typeorm'
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
}
