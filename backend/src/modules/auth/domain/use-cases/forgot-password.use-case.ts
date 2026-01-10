import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SendVerificationCodeUseCase } from 'src/modules/mail/domain/use-cases/send-verification-code.use-case';
import { UsersAuthGatewayInterface } from 'src/modules/users/infra/gateway/user-auth/users-auth.interface';
import { UsersGatewayInterface } from 'src/modules/users/infra/gateway/user/users.gateway.interface';
import { HashUtil } from 'src/shared/utils/hash.util';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase,
        @Inject('UsersGatewayInterface')
        private readonly usersGateway: UsersGatewayInterface,
        @Inject('UsersAuthGatewayInterface')
        private readonly usersAuthGateway: UsersAuthGatewayInterface,
    ) {}

    async execute(userEmail: string): Promise<void> {
        const user = await this.usersGateway.findOneBy({ email: userEmail });
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const verificationCode = this.generateVerificationCode();

        const hashedCode = await HashUtil.hash(verificationCode);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        const userAuth = await this.usersAuthGateway.findOneBy({ user_id: user.id });
        
        if (!userAuth) {
            throw new NotFoundException('User authentication not found');
        }

        await this.usersAuthGateway.update(userAuth.id, {
            verification_code: hashedCode,
            verification_code_expires_at: expiresAt,
            verification_code_validated_at: null,
        });

        await this.sendVerificationCodeUseCase.execute(userEmail, verificationCode);
    }

    private generateVerificationCode(): string {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 9 + 1).toString();
        }
        return code;
    }
}
