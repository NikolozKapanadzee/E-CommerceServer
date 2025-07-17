import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';

@Injectable()
export class AppService {
  constructor(private emailService: EmailService) {}
  getHello(): string {
    return 'Hello World!';
  }

  // async sendEmail(to, otpCode) {
  //   await this.emailService.sendOTPCode(to, otpCode);
  //   console.log('send email succ');
  // }
}
