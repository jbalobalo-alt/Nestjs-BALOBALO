import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailController } from './email.controller'; // dinagdag ko po

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'jbalobalo@gmail.com', // wala pa laman gmail
          pass: '123456789',   // not done App Password (not your Gmail password)
        },
      },
      defaults: {
        from: '"My App" <yourgmail@gmail.com>',
      },
    }),
  ],
  controllers: [EmailController], //  idinagdag ko
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
