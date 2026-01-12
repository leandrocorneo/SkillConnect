import { Inject } from "@nestjs/common";
import { UserAuth } from "src/core/entities/user-auth.entity";
import { UsersAuthGatewayInterface } from "src/modules/users/infra/gateway/user-auth/users-auth.interface";

export class UpdateUserAuthUseCase {
    constructor(
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface
    ){}

    async execute(id: number, userAuth: Partial<UserAuth>): Promise<void> {
        return this.usersAuthGateway.update(id, userAuth);
    }
}