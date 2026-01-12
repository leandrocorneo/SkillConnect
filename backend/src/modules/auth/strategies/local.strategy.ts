import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LocalAuthUseCase } from '../domain/use-cases/local-auth.use-case';
import { UnauthorizedError } from 'src/core/errors/domain.error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private localAuthUseCase: LocalAuthUseCase) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.localAuthUseCase.execute({ email, password });

    if (!user) throw new UnauthorizedError('Email ou senha inválidos');
    return user;
  }
}