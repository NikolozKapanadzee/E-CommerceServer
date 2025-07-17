import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendOTPCode(to, otpCode) {
    const options = {
      to,
      from: 'E-Commerce <nkapanadze369@gmail.com>',
      subject: 'OTP Code',
      html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; color: #333;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px;">
    <h2 style="text-align: center; font-size: 20px; margin: 0 0 15px;">Verify Your Email</h2>
    <p style="text-align: center; font-size: 16px; color: #555;">Use this OTP to verify your email:</p>
    <div style="text-align: center; font-size: 24px; font-weight: bold; color: #007bff; margin: 15px 0;">${otpCode}</div>
    <p style="text-align: center; font-size: 14px; color: #555;">This code expires in 3 minutes.</p>
  </div>
</body>`,
    };
    await this.mailerService.sendMail(options);
  }
}
