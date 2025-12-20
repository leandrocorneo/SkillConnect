import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt.guard';
import { CreateUserDto } from '../dto/input/create-user.dto';
import { RegisterResponseDto } from '../dto/output/register-response.dto';
import { FindUserOneByUseCase } from '../../domain/use-cases/users/find-one-by-id.use-case';
import { RegisterUseCase } from 'src/modules/users/domain/use-cases/users/register.use-case';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';
import { EditProfileDto } from '../dto/input/edit-profile.dto';
import { EditProfileResponseDto } from '../dto/output/edit-profile-response.dto';
import { EditProfileUseCase } from '../../domain/use-cases/users/edit-profile.use-case';
import { ReqUser } from 'src/shared/types/interface/requestUser.interface';

@Controller('users')
export class UserController {
  constructor(
    private readonly findOneByIdUseCase: FindUserOneByUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly editProfileUseCase: EditProfileUseCase,
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

  @UseGuards(JwtAuthGuard)
  @Put(':id/edit-profile')
  async editProfile(@Param('id') id: number, @Body() userDto: EditProfileDto, @Req() req: ReqUser): Promise<BaseResponseDto<RegisterResponseDto>> {
    const user = await this.findOneByIdUseCase.execute({ id });
    const reqUserId = req.user.id;
    const { userAuth, ...userWithoutRelations } = user;
    const updatedUser = Object.assign(userWithoutRelations, userDto);
    await this.editProfileUseCase.execute(updatedUser, reqUserId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User profile updated successfully',
      data: updatedUser as EditProfileResponseDto,
    };
  }
}
