import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const basePayload = {
        sub: payload.sub,
        name: payload.name,
        role: payload.role,
      };

      const newAccessToken = this.jwtService.sign(basePayload, {
        expiresIn: '24h',
      });
      const newRefreshToken = this.jwtService.sign(basePayload, {
        expiresIn: '7d',
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
