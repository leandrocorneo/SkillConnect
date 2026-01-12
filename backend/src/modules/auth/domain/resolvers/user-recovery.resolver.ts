import { Inject, Injectable } from "@nestjs/common";
import { UserAuth } from "src/core/entities/user-auth.entity";
import { User } from "src/core/entities/user.entity";
import { ResourceNotFoundError } from "src/core/errors/domain.error";
import { UsersAuthGatewayInterface } from "src/modules/users/infra/gateway/user-auth/users-auth.interface";
import { UsersGatewayInterface } from "src/modules/users/infra/gateway/user/users.gateway.interface";

@Injectable()
export class UserRecoveryResolver {
    constructor(
        @Inject('UsersGatewayInterface')
        private readonly usersGateway: UsersGatewayInterface,
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface,
    ) {}

    async resolveByEmail(email: string): Promise<{ user: User; userAuth: UserAuth }> {
        const user = await this.usersGateway.findOneBy({ email });

        if (!user) {
            throw new ResourceNotFoundError('User');
        }

        const userAuth = await this.usersAuthGateway.findOneBy({
            user_id: user.id,
        });

        if (!userAuth) {
            throw new ResourceNotFoundError('User authentication');
        }

        return { user, userAuth };
    }
}