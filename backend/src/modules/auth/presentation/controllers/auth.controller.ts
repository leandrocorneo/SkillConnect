import { Controller, Post, UseGuards, Request, Body, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from '../../../../shared/guards/local.guard';
import { ReqUser } from 'src/shared/types/interface/requestUser.interface';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../domain/use-cases/refresh-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ReqUser, @Res() res: Response) {

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
  async refresh(@Request() req, @Res() res: Response) {
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {

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
}

