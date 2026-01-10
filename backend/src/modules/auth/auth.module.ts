import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalAuthUseCase } from './domain/use-cases/local-auth.use-case';
import { LocalAuthGuard } from '../../shared/guards/local.guard';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { RefreshTokenUseCase } from './domain/use-cases/refresh-token.use-case';
import { ForgotPasswordUseCase } from './domain/use-cases/forgot-password.use-case';
import { VerifyRecoveryCodeUseCase } from './domain/use-cases/verify-recovery-code.use-case';
import { ResetPasswordUseCase } from './domain/use-cases/reset-password.use-case';
import { UserRecoveryResolver } from './domain/resolvers/user-recovery.resolver';

@Module({
  imports: [
    UsersModule,
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const expiration = configService.get<string>('JWT_EXPIRATION') || '86400';
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { 
            expiresIn: parseInt(expiration, 10)
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    LocalAuthUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    VerifyRecoveryCodeUseCase,
    ResetPasswordUseCase,
    UserRecoveryResolver,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
