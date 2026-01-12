import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedError } from "src/core/errors/domain.error";

@Injectable()
export class ValidateTokenUseCase {
    constructor(private readonly jwtService: JwtService) {}

    async execute(token: string): Promise<void> {
        try {
            this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    }
}