import { Inject, Injectable } from '@nestjs/common';
import { SendVerificationCodeUseCase } from 'src/modules/mail/domain/use-cases/send-verification-code.use-case';
import { UsersAuthGatewayInterface } from 'src/modules/users/infra/gateway/user-auth/users-auth.interface';
import { UsersGatewayInterface } from 'src/modules/users/infra/gateway/user/users.gateway.interface';
import { HashUtil } from 'src/shared/utils/hash.util';
import { UserRecoveryResolver } from '../resolvers/user-recovery.resolver';
import { UpdateUserAuthUseCase } from 'src/modules/users/domain/use-cases/user-auth/update-user-auth.use-case';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase,
        private readonly updateUserAuthUseCase: UpdateUserAuthUseCase,
        private readonly userRecoveryResolver: UserRecoveryResolver,
    ) {}

    async execute(userEmail: string): Promise<void> {
        const { user, userAuth } = await this.userRecoveryResolver.resolveByEmail(userEmail);

        const verificationCode = this.generateVerificationCode();

        const hashedCode = await HashUtil.hash(verificationCode);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        await this.updateUserAuthUseCase.execute(userAuth.id, {
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
