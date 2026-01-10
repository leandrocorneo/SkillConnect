import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
            throw new NotFoundException('User not found');
        }

        const userAuth = await this.usersAuthGateway.findOneBy({ user_id: user.id });
        
        if (!userAuth) {
            throw new NotFoundException('User authentication not found');
        }

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
