import { MailerService } from "@nestjs-modules/mailer";
import { sendEmailUserInterface } from "./send-email-user.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendEmailUserNodemailer implements sendEmailUserInterface {

    constructor(
        private readonly mailService: MailerService
    ){}

    async sendVerificationCode(userEmail: string, verificationCode: string): Promise<void> {
        const currentYear = new Date().getFullYear();

        await this.mailService.sendMail({
            to: userEmail,
            subject: 'Código de Verificação - SkillConnect',
            template: './users/verification-code',
            context: {
                verificationCode: verificationCode,
                year: currentYear,
            },
        });
    }
}