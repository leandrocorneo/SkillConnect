import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/core/entities/user.entity';
import { Roles } from 'src/core/object-value/user-roles.enum';
import { FindUserAuthByUseCase } from 'src/modules/users/domain/use-cases/user-auth/find-user-auth-by.use-case';
import { FindUserOneByUseCase } from 'src/modules/users/domain/use-cases/users/find-one-by-id.use-case';
import { HashUtil } from 'src/shared/utils/hash.util';

@Injectable()
export class LoginUseCase {
  constructor(
    private jwtService: JwtService,
  ) {}

  async execute(user: User) {
    const payload = { name: user.name, sub: user.id, role: user.role as Roles };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

}