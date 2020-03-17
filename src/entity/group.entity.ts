import {
  BaseEntity,
  CreateDateColumn,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from './user.entity'

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  subject: string

  @Column()
  description: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column()
  room: number

  @Column()
  doNotDisturb: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToMany(() => User, user => user.groups, { cascade: true })
  @JoinTable()
  users: User[]

  @ManyToOne(() => User, user => user.ownedGroups, { cascade: true })
  @JoinColumn()
  owner: User
}
