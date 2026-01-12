import { Inject, Injectable } from '@nestjs/common';
import { BadRequestError, ResourceNotFoundError } from 'src/core/errors/domain.error';
import { UsersAuthGatewayInterface } from 'src/modules/users/infra/gateway/user-auth/users-auth.interface';
import { UsersGatewayInterface } from 'src/modules/users/infra/gateway/user/users.gateway.interface';
import { HashUtil } from 'src/shared/utils/hash.util';

@Injectable()
export class VerifyCodeUseCase {
    constructor(
        @Inject('UsersGatewayInterface')
        private readonly usersGateway: UsersGatewayInterface,
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface,
    ) {}

    async execute(email: string, code: string): Promise<{ userId: number }> {
        const user = await this.usersGateway.findOneBy({ email });
        
        if (!user) {
            throw new ResourceNotFoundError('User');
        }

        const userAuth = await this.usersAuthGateway.findOneBy({ user_id: user.id });
        
        if (!userAuth) {
            throw new ResourceNotFoundError('User authentication');
        }

        if (!userAuth.verification_code || !userAuth.verification_code_expires_at) {
            throw new BadRequestError('No verification code found for this user');
        }

        const now = new Date();
        if (now > userAuth.verification_code_expires_at) {
            throw new BadRequestError('Verification code has expired');
        }

        const isCodeValid = await HashUtil.compare(code, userAuth.verification_code);
        
        if (!isCodeValid) {
            throw new BadRequestError('Invalid verification code');
        }

        await this.usersAuthGateway.update(userAuth.id, {
            verification_code_validated_at: new Date(),
        });

        return { userId: user.id };
    }
}
