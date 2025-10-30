import { Injectable } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';

export interface UsersGatewayInterface {
  findAll(): Promise<User[]>;
  findOneBy(where: Partial<User>): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
}