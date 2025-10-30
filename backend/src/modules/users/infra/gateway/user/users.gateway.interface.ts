import { Injectable } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';

export interface UsersGatewayInterface {
  findAllForSelect(): Promise<{ value: number; label: string }[]>;
  findOneBy(where: Partial<User>): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
}