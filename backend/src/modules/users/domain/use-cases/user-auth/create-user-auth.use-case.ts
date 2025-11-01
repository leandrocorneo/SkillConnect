import { Inject, Injectable } from "@nestjs/common";
import { UserAuth } from "src/core/entities/user-auth.entity";
import { UsersAuthGatewayInterface } from "src/modules/users/infra/gateway/user-auth/users-auth.interface";

@Injectable()
export class CreateUserAuthUseCase {
    constructor(
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface,
    ){}

    async execute(UserAuth: Partial<UserAuth>): Promise<UserAuth> {
        return this.usersAuthGateway.create(UserAuth);
    }
}