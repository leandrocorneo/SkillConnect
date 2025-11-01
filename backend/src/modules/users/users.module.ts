import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core/entities/user.entity';
import { UserAuth } from 'src/core/entities/user-auth.entity';
import { FindUserOneByUseCase } from './domain/use-cases/users/find-one-by-id.use-case';
import { FindUserAuthByUseCase } from './domain/use-cases/user-auth/find-user-auth-by.use-case';
import { UsersGatewayTypeorm } from './infra/gateway/user/users.gateway.typeorm';
import { UsersAuthGatewayTypeorm } from './infra/gateway/user-auth/users-auth.gateway.typeorm';
import { UserController } from './presentation/controllers/user.controller';
import { RegisterUseCase } from './domain/use-cases/users/register.use-case';
import { CreateUserAuthUseCase } from './domain/use-cases/user-auth/create-user-auth.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuth])],
  controllers: [UserController],
  providers: [
    FindUserOneByUseCase,
    FindUserAuthByUseCase,
    RegisterUseCase,
    UsersGatewayTypeorm,
    UsersAuthGatewayTypeorm,
    CreateUserAuthUseCase,
    {
      provide: 'UsersGatewayInterface',
      useClass: UsersGatewayTypeorm
    },
    {
      provide: 'UsersAuthGatewayInterface',
      useClass: UsersAuthGatewayTypeorm
    }
  ],
  exports: [FindUserOneByUseCase, FindUserAuthByUseCase],
})
export class UsersModule {}
