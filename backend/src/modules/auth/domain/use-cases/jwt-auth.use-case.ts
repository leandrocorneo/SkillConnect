import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/core/entities/user.entity';
import { Roles } from 'src/core/object-value/user-roles.enum';
import { FindUserAuthByUseCase } from 'src/modules/users/domain/use-cases/user-auth/find-user-auth-by.use-case';
import { FindUserOneByUseCase } from 'src/modules/users/domain/use-cases/users/find-one-by-id.use-case';
import { HashUtil } from 'src/shared/utils/hash.util';

@Injectable()
export class JwtAuthUseCase {
  constructor(
    private jwtService: JwtService,
    private findOneUserByIdUseCase: FindUserOneByUseCase,
    private findUserAuthByUseCase: FindUserAuthByUseCase,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findOneUserByIdUseCase.execute({ email });

    if (!user) return null;

    const userAuth = await this.findUserAuthByUseCase.execute({ id: user.id });
    if (!userAuth) return null;

    const isPasswordValid = await HashUtil.compare(pass, userAuth.hash_password);
    if (!isPasswordValid) return null;

    return user;
  }

  login(user: User) {
    const payload = { name: user.name, sub: user.id, role: user.role as Roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}