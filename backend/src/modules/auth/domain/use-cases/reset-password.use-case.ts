import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersAuthGatewayInterface } from 'src/modules/users/infra/gateway/user-auth/users-auth.interface';
import { HashUtil } from 'src/shared/utils/hash.util';
import { UserRecoveryResolver } from '../resolvers/user-recovery.resolver';

@Injectable()
export class ResetPasswordUseCase {
    constructor(
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface,
        private readonly userRecoveryResolver: UserRecoveryResolver,
    ) {}

    async execute(email: string, newPassword: string): Promise<void> {
        const { userAuth } = await this.userRecoveryResolver.resolveByEmail(email);

        if (!userAuth.verification_code_validated_at) {
            throw new BadRequestException('Verification code must be validated before resetting password');
        }

        const now = new Date();
        const validatedAt = new Date(userAuth.verification_code_validated_at);
        const timeDiff = (now.getTime() - validatedAt.getTime()) / 1000 / 60;

        if (timeDiff > 10) {
            throw new BadRequestException('Validation has expired. Please request a new verification code');
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
