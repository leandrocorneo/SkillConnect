import { Controller, Post, UseGuards, Request, Body, Res, HttpStatus, HttpCode, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from '../../../../shared/guards/local.guard';
import { ReqUser } from 'src/shared/types/interface/requestUser.interface';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../domain/use-cases/refresh-token.use-case';
import { ForgotPasswordUseCase } from '../../domain/use-cases/forgot-password.use-case';
import { VerifyRecoveryCodeUseCase } from '../../domain/use-cases/verify-recovery-code.use-case';
import { ResetPasswordUseCase } from '../../domain/use-cases/reset-password.use-case';
import { LoginResponseDto } from '../dto/output/login-response.dto';
import { BaseResponseDto } from 'src/shared/dto/base-response.dto';
import { VerifyCodeDto } from '../dto/input/verify-code.dto';
import { ResetPasswordDto } from '../dto/input/reset-password.dto';
import { ValidateTokenUseCase } from '../../domain/use-cases/validate-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyRecoveryCodeUseCase: VerifyRecoveryCodeUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ReqUser, @Res() res: Response): Promise<Response<LoginResponseDto>> {

    const result = await this.loginUseCase.execute(req.user);

    res.cookie('auth', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req, @Res() res: Response): Promise<Response<BaseResponseDto<null>>> {
    const refreshToken = req.cookies['refresh_token'];
    const result = await this.refreshTokenUseCase.execute(refreshToken);

    res.cookie('auth', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({ 
      statusCode: HttpStatus.OK,
      message: 'Access token refreshed',
      data: null
    });
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Request() req, @Res() res: Response): Promise<Response<BaseResponseDto<null>> > {
    const token = req.cookies['auth'];
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    await this.validateTokenUseCase.execute(token);

    return res.json({ 
      statusCode: HttpStatus.OK,
      message: 'Token is valid',
      data: null
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response): Promise<Response<BaseResponseDto<null>>> {

    res.clearCookie('auth', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({ 
      statusCode: HttpStatus.OK,
      message: 'Logged out successfully', 
      data: null
    });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string, @Res() res: Response): Promise<Response<BaseResponseDto<null>>> {

    await this.forgotPasswordUseCase.execute(email);

    return res.json({ 
      statusCode: HttpStatus.OK,
      message: 'Email sent with verification code',
      data: null
    });
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto, @Res() res: Response): Promise<Response<BaseResponseDto<{ userId: number }>>> {

    const result = await this.verifyRecoveryCodeUseCase.execute(verifyCodeDto.email, verifyCodeDto.code);

    return res.json({
      statusCode: HttpStatus.OK,
      message: 'Code verified successfully',
      data: result
    });
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res: Response): Promise<Response<BaseResponseDto<null>>> {

    await this.resetPasswordUseCase.execute(resetPasswordDto.email, resetPasswordDto.newPassword);

    return res.json({
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
      data: null
    });
  }
}

