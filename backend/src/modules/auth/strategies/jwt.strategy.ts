import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/shared/types/interface/jwtPayload.interface';
import { FindUserOneByUseCase } from 'src/modules/users/domain/use-cases/users/find-one-by-id.use-case';
import { cookieExtractor } from 'src/shared/utils/cookie-extractor.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly findUserByUseCase: FindUserOneByUseCase,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    const user = this.findUserByUseCase.execute({ id: payload.sub });

    return user;
  }
}