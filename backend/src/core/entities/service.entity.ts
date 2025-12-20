import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Address } from './address.entity';
import { Review } from './review.entity';
import { Order } from './order.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'price', type: 'numeric' })
  price: number;

  @Column({ name: 'availiable', type: 'boolean', default: true })
  availiable: boolean;

  @Column({ name: 'description', type: 'varchar' })
  description: string;

  @Column({ name: 'address_id', type: 'int' })
  addressId: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.services)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.services)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Address, (address) => address.services)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.service)
  orders: Order[];
}
