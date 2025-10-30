import { Injectable } from '@nestjs/common';
import { UserAuth } from 'src/core/entities/user-auth.entity';
import { Inject } from '@nestjs/common';
import { UsersAuthGatewayInterface } from '../../../infra/gateway/user-auth/users-auth.interface';

@Injectable()
export class FindUserAuthByUseCase {
  constructor(
    @Inject('UsersAuthGatewayInterface')
    private readonly usersAuthGateway: UsersAuthGatewayInterface,
  ) {}

  async execute(where: Partial<UserAuth>): Promise<UserAuth | null> {
    return this.usersAuthGateway.findOneBy(where);
  }
}