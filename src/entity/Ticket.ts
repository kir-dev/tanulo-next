import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  description: string

  @Column()
  roomNumber: number

  @CreateDateColumn()
  createdAt: Date
}