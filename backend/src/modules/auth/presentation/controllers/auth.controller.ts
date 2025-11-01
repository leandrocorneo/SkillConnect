import { Controller, Post, UseGuards, Request, Body, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthUseCase } from '../../domain/use-cases/jwt-auth.use-case';
import { LocalAuthGuard } from '../../../../shared/guards/local.guard';
import { ReqUser } from 'src/shared/types/interface/requestUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private jwtAuthUseCase: JwtAuthUseCase) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ReqUser, @Res() res: Response) {

    const token = await this.jwtAuthUseCase.login(req.user);

    res.cookie('auth', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({
      user: {
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
    const result = await this.jwtAuthUseCase.refresh(refreshToken);

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

    return res.json({ message: 'Access token refreshed' });
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

    return res.json({ message: 'Logged out successfully' });
  }
}

