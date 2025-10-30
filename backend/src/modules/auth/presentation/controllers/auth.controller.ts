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
    console.log('User authenticated:', req.user);
    const token = await this.jwtAuthUseCase.login(req.user);

    res.cookie('auth', token.access_token, {
      httpOnly: true,
      secure: false,
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
}

