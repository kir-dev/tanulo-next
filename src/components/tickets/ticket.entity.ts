import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
