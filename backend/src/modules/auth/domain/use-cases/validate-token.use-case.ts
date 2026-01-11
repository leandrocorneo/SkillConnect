import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ValidateTokenUseCase {
    constructor(private readonly jwtService: JwtService) {}

    async execute(token: string): Promise<void> {
        try {
            this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}