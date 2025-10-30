import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalAuthUseCase } from './domain/use-cases/local-auth.use-case';
import { JwtAuthUseCase } from './domain/use-cases/jwt-auth.use-case';
import { LocalAuthGuard } from '../../shared/guards/local.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const expiration = configService.get<string>('JWT_EXPIRATION') || '86400'; // 24h in seconds
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
    JwtAuthUseCase,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
