import { Inject, Injectable } from '@nestjs/common';
import { BadRequestError, ResourceNotFoundError } from 'src/core/errors/domain.error';
import { UsersAuthGatewayInterface } from 'src/modules/users/infra/gateway/user-auth/users-auth.interface';
import { UsersGatewayInterface } from 'src/modules/users/infra/gateway/user/users.gateway.interface';
import { HashUtil } from 'src/shared/utils/hash.util';

@Injectable()
export class ResetPasswordUseCase {
    constructor(
        @Inject('UsersGatewayInterface')
        private readonly usersGateway: UsersGatewayInterface,
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface,
    ) {}

    async execute(email: string, newPassword: string): Promise<void> {
        const user = await this.usersGateway.findOneBy({ email });
        
        if (!user) {
            throw new ResourceNotFoundError('User');
        }

        const userAuth = await this.usersAuthGateway.findOneBy({ user_id: user.id });
        
        if (!userAuth) {
            throw new ResourceNotFoundError('User authentication');
        }

        if (!userAuth.verification_code_validated_at) {
            throw new BadRequestError('Verification code must be validated before resetting password');
        }

        const now = new Date();
        const validatedAt = new Date(userAuth.verification_code_validated_at);
        const timeDiff = (now.getTime() - validatedAt.getTime()) / 1000 / 60;

        if (timeDiff > 10) {
            throw new BadRequestError('Validation has expired. Please request a new verification code');
        }

        const hashedPassword = await HashUtil.hash(newPassword);

        await this.usersAuthGateway.update(userAuth.id, {
            hash_password: hashedPassword,
            verification_code: null,
            verification_code_expires_at: null,
            verification_code_validated_at: null,
        });
    }
}
