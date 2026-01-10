import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { SendEmailUserNodemailer } from './infra/gateway/send-email-user.nodemailer';
import { SendVerificationCodeUseCase } from './domain/use-cases/send-verification-code.use-case';

const GatewayProviders = [
  {
    provide: 'sendEmailUserInterface',
    useClass: SendEmailUserNodemailer
  }
];

const UseCaseProviders = [
  SendVerificationCodeUseCase
];

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
              user: configService.get<string>('MAIL_USER'),
              pass: configService.get<string>('MAIL_PASS'),
            },
          },
          defaults: {
            from: 'SkillConnect <noreply@skillconnect.com>',
          },
          template: {
            dir: join(process.cwd(), 'src/modules/mail/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [...GatewayProviders, ...UseCaseProviders],
  exports: [...GatewayProviders, ...UseCaseProviders],
})
export class MailModule {}
