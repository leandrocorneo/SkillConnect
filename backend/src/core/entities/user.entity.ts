import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../object-value/user-roles.enum';
import { UserAuth } from './user-auth.entity';
import { Service } from './service.entity';
import { Review } from './review.entity';
import { Order } from './order.entity';
import { Message } from './message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ name: 'document', type: 'char', length: 11 })
  document: string;

  @Column({ name: 'role',  type: 'enum', enum: Roles })
  role: Roles;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => UserAuth, (userAuth) => userAuth.user)
  userAuth: UserAuth;

  @OneToMany(() => Service, (service) => service.user)
  services: Service[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}