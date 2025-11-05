import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt.guard';
import { CreateUserDto } from '../dto/input/create-user.dto';
import { RegisterResponseDto } from '../dto/output/register-response.dto';
import { FindUserOneByUseCase } from '../../domain/use-cases/users/find-one-by-id.use-case';
import { UsersGatewayTypeorm } from '../../infra/gateway/user/users.gateway.typeorm';
import { RegisterUseCase } from 'src/modules/users/domain/use-cases/users/register.use-case';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly findOneByIdUseCase: FindUserOneByUseCase,
    private readonly usersGateway: UsersGatewayTypeorm,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post()
  async register(@Body() userDto: CreateUserDto): Promise<BaseResponseDto<RegisterResponseDto>> {    
    const user = await this.registerUseCase.execute(userDto, userDto.role);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: user as RegisterResponseDto,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BaseResponseDto<RegisterResponseDto>> {
    const user = await this.findOneByIdUseCase.execute({ id });
    const { userAuth, ...userResponse } = user;
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: userResponse as RegisterResponseDto,
    }
  }
}
