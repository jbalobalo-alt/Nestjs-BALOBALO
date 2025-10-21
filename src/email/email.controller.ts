import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';


@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // Example: GET /test-email?to=someone@example.com&name=James
  @Get()
  async sendTestEmail(@Query('to') to: string, @Query('name') name: string) {
    const toAddress = to || 'recipient@example.com'; // default recipient wala pa
    const personName = name || 'Friend';

    await this.emailService.sendWelcomeEmail(toAddress, personName);

    return { message: `Email sent successfully to ${toAddress}` };
  }
}
