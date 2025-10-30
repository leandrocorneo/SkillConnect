import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LocalAuthUseCase } from '../domain/use-cases/local-auth.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private localAuthUseCase: LocalAuthUseCase) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.localAuthUseCase.authenticate(email, password);

    if (!user) throw new UnauthorizedException('Email ou senha inválidos');
    return user;
  }
}