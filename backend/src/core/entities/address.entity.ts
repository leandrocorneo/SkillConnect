import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from './service.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'street', type: 'varchar' })
  street: string;

  @Column({ name: 'neightborhood', type: 'varchar' })
  neightborhood: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Service, (service) => service.address)
  services: Service[];
}
