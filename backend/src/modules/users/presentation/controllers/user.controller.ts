import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt.guard';
import { CreateUserDto } from '../dto/input/create-user.dto';
import { RegisterResponseDto } from '../dto/output/register-response.dto';
import { FindUserOneByUseCase } from '../../domain/use-cases/users/find-one-by-id.use-case';
import { HashUtil } from 'src/shared/utils/hash.util';
import { UsersGatewayTypeorm } from '../../infra/gateway/user/users.gateway.typeorm';
import { UsersAuthGatewayTypeorm } from '../../infra/gateway/user-auth/users-auth.gateway';

@Controller('users')
export class UserController {
  constructor(
    private readonly findOneByIdUseCase: FindUserOneByUseCase,
    private readonly usersGateway: UsersGatewayTypeorm,
    private readonly usersAuthGateway: UsersAuthGatewayTypeorm,
  ) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    const { password, ...userData } = createUserDto;
    
    const user = await this.usersGateway.create(userData);

    const hashedPassword = await HashUtil.hash(password);
    await this.usersAuthGateway.create({
      user_id: user.id,
      hash_password: hashedPassword,
    });

    const { userAuth, ...userResponse } = user;
    return userResponse as RegisterResponseDto;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<RegisterResponseDto> {
    const user = await this.findOneByIdUseCase.execute({ id });
    const { userAuth, ...userResponse } = user;
    return userResponse as RegisterResponseDto;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllForSelect() {
    return this.usersGateway.findAllForSelect();
  }
}
