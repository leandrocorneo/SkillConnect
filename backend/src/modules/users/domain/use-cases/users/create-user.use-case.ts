import { Inject } from "@nestjs/common";
import { User } from "src/core/entities/user.entity";
import { UsersGatewayInterface } from "src/modules/users/infra/gateway/user/users.gateway.interface";

export class CreateUserUseCase{
    constructor(
        @Inject('UsersGatewayInterface')
        private readonly usersGateway: UsersGatewayInterface,
    ){}

    async execute(userData: Partial<User>): Promise<User> {
        return this.usersGateway.create(userData);
    }
}