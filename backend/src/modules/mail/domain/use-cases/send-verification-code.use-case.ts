import { Inject, Injectable } from '@nestjs/common';
import { sendEmailUserInterface } from 'src/modules/mail/infra/gateway/send-email-user.interface';

@Injectable()
export class SendVerificationCodeUseCase {
    constructor(
        @Inject('sendEmailUserInterface')
        private readonly sendEmailGateway: sendEmailUserInterface,
    ) {}

    async execute(userEmail: string, verificationCode: string): Promise<void> {
        await this.sendEmailGateway.sendVerificationCode(userEmail, verificationCode);
    }
}
