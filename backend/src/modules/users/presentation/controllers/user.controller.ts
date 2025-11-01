import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt.guard';
import { CreateUserDto } from '../dto/input/create-user.dto';
import { RegisterResponseDto } from '../dto/output/register-response.dto';
import { FindUserOneByUseCase } from '../../domain/use-cases/users/find-one-by-id.use-case';
import { UsersGatewayTypeorm } from '../../infra/gateway/user/users.gateway.typeorm';
import { RegisterUseCase } from 'src/modules/users/domain/use-cases/users/register.use-case';

@Controller('users')
export class UserController {
  constructor(
    private readonly findOneByIdUseCase: FindUserOneByUseCase,
    private readonly usersGateway: UsersGatewayTypeorm,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post()
  async register(@Body() userDto: CreateUserDto): Promise<RegisterResponseDto> {    
    const user = await this.registerUseCase.execute(userDto, userDto.role);
    return user;
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
    return this.usersGateway.findAll();
  }
}
