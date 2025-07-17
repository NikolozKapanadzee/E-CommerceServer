import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from '../common/guard/isAuth.guard';
import { UserId } from 'src/common/decorator/user.decorator';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { ResendOtpDTO } from './dto/resend-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDTO) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification-code')
  verificatinCode(@Body() email: ResendOtpDTO) {
    return this.authService.resendOTPCode(email);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentuser(@UserId() userId) {
    console.log(userId);
    return this.authService.getCurrentUser(userId);
  }
}
