import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Our App!',
      text: `Hello ${name}, welcome to our platform!`,
      html: `<h3>Hello ${name},</h3><p>Welcome to our platform!</p>`,
    });
  }
}
