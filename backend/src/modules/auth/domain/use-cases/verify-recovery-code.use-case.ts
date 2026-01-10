import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersAuthGatewayInterface } from 'src/modules/users/infra/gateway/user-auth/users-auth.interface';
import { HashUtil } from 'src/shared/utils/hash.util';
import { UserRecoveryResolver } from '../resolvers/user-recovery.resolver';

@Injectable()
export class VerifyRecoveryCodeUseCase {
    constructor(
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface,
        private readonly userRecoveryResolver: UserRecoveryResolver,
    ) {}

    async execute(email: string, code: string): Promise<{ userId: number }> {
        const { user, userAuth } = await this.userRecoveryResolver.resolveByEmail(email);

        if (!userAuth.verification_code || !userAuth.verification_code_expires_at) {
            throw new BadRequestException('No verification code found for this user');
        }

        const now = new Date();
        if (now > userAuth.verification_code_expires_at) {
            throw new BadRequestException('Verification code has expired');
        }

        const isCodeValid = await HashUtil.compare(code, userAuth.verification_code);
        
        if (!isCodeValid) {
            throw new BadRequestException('Invalid verification code');
        }

        await this.usersAuthGateway.update(userAuth.id, {
            verification_code_validated_at: new Date(),
        });

        return { userId: user.id };
    }
}
