import { Injectable } from "@nestjs/common";
import { UserAuth } from "src/core/entities/user-auth.entity";
import { User } from "src/core/entities/user.entity";
import { Roles } from "src/core/object-value/user-roles.enum";
import { CreateUserDto } from "src/modules/users/presentation/dto/input/create-user.dto";
import { RegisterResponseDto } from "src/modules/users/presentation/dto/output/register-response.dto";
import { HashUtil } from "src/shared/utils/hash.util";
import { CreateUserAuthUseCase } from "../user-auth/create-user-auth.use-case";
import { CreateUserUseCase } from "./create-user.use-case";
import { FindUserOneByUseCase } from "./find-one-by-id.use-case";
import { ConflictError } from "src/core/errors/domain.error";

@Injectable()
export class RegisterUseCase {
    constructor(
        private readonly createUserAuthUseCase: CreateUserAuthUseCase,
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findOneByUseCase: FindUserOneByUseCase,
    ){}

    async execute(
        dto: CreateUserDto,
        role: Roles
    ): Promise<RegisterResponseDto> {
        await this.validateUser(dto.email);

        const user = await this.createUserUseCase.execute({
            ...dto,
            role,
        });

        const userAuth = await this.createUserAuth({
            password: dto.password,
            user
        });

        return this.buildResponse(user);
    }

    private async validateUser(email: string) {
        const user = await this.findOneByUseCase.execute({ email });
        if (user) {
            throw new ConflictError('User with this email already exists');
        }
    }

    private async createUserAuth({ password, user }: { password: string, user: User }) {
        const userAuth = new UserAuth({
            user_id: user.id,
            hash_password: await HashUtil.hash(password),
        });
        return this.createUserAuthUseCase.execute(userAuth);
    }

    private buildResponse(user: User): RegisterResponseDto {
        const response = new RegisterResponseDto();
        response.id = user.id;
        response.name = user.name;
        response.email = user.email;
        response.role = user.role;
        return response;
    }
}