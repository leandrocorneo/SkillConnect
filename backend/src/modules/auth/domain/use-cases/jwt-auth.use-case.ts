import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  refresh(refreshToken: string){
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, name: payload.name, role: payload.role },
        { expiresIn: '24h' },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, name: payload.name, role: payload.role },
        { expiresIn: '7d' },
      );
      return { 
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}