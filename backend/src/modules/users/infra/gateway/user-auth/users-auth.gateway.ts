import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from 'src/core/entities/user-auth.entity';
import { Repository } from 'typeorm';
import { UsersAuthGatewayInterface } from './users-auth.interface';

@Injectable()
export class UsersAuthGatewayTypeorm implements UsersAuthGatewayInterface {
  constructor(
    @InjectRepository(UserAuth)
    private readonly userRepository: Repository<UserAuth>,
  ) {}

  async findOneBy(where: Partial<UserAuth>): Promise<UserAuth | null> {
    return this.userRepository.findOne({ where });
  }

  async create(userAuth: Partial<UserAuth>): Promise<UserAuth> {
    return this.userRepository.save(userAuth);
  }
}