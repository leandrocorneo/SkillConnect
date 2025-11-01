import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { UserAuth } from "src/core/entities/user-auth.entity";
import { User } from "src/core/entities/user.entity";
import { Roles } from "src/core/object-value/user-roles.enum";
import { UsersGatewayInterface } from "src/modules/users/infra/gateway/user/users.gateway.interface";
import { CreateUserDto } from "src/modules/users/presentation/dto/input/create-user.dto";
import { RegisterResponseDto } from "src/modules/users/presentation/dto/output/register-response.dto";
import { HashUtil } from "src/shared/utils/hash.util";
import { CreateUserAuthUseCase } from "../user-auth/create-user-auth.use-case";

@Injectable()
export class RegisterUseCase {
    private readonly logger = new Logger(RegisterUseCase.name);

    constructor(
        @Inject('UsersGatewayInterface')
        private readonly usersGateway: UsersGatewayInterface,
        private readonly CreateUserAuthUseCase: CreateUserAuthUseCase,
    ){}

    async execute(
        dto: CreateUserDto,
        role: Roles
    ): Promise<RegisterResponseDto> {
        await this.validateUser(dto.email);

        const user = await this.usersGateway.create({
            ...dto,
            role,
        })

        const userAuth = await this.createUserAuth({
            password: dto.password,
            user
        });

        return this.buildResponse(user);
    }

    private async validateUser(email: string) {
        const user = await this.usersGateway.findOneBy({ email });
        if (user) {
            this.logger.warn(
                `Tentativa de cadastro com email já existente: ${email}`,
            );

            throw new BadRequestException('Não foi possível processar o cadastro');
        }
    }

    private async createUserAuth({ password, user }: { password: string, user: User }) {
        const userAuth = new UserAuth({
            user_id: user.id,
            hash_password: await HashUtil.hash(password),
        });
        return this.CreateUserAuthUseCase.execute(userAuth);
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