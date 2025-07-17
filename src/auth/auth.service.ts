import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enum/roles.enum';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { ResendOtpDTO } from './dto/resend-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signUp({ email, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = Math.random().toString().slice(2, 8);
    const validationDate = new Date();
    validationDate.setTime(validationDate.getTime() + 3 * 60 * 1000);
    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      role: Role.CLIENT,
      OTPCode: otpCode,
      OPTValidationDate: validationDate,
    });

    await this.emailService.sendOTPCode(email, otpCode);

    return {
      message: 'sign up successful check the email',
      data: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async verifyEmail({ email, otpCode }: VerifyEmailDTO) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('user not found');
    if (user.isActive)
      throw new BadRequestException('user is already verified');
    if (new Date(user.OPTValidationDate as string) < new Date())
      throw new BadRequestException('OTP code is outdated');
    if (user.OTPCode !== otpCode)
      throw new BadRequestException('invalid otp provided');

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: { OTPCode: null, OPTValidationDate: null, isActive: true },
      },
    );
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return {
      message: 'you have passed verifitation successfully',
      token,
      role: user.role,
    };
  }

  async resendOTPCode({ email }: ResendOtpDTO) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('user not found');
    const otpCode = Math.random().toString().slice(2, 8);
    const validationDate = new Date();
    validationDate.setTime(validationDate.getTime() + 3 * 60 * 1000);

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: { OTPCode: otpCode, OPTValidationDate: validationDate },
      },
    );
    await this.emailService.sendOTPCode(email, otpCode);

    return 'check email to finish verification';
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('+password role isActive');

    if (!existUser) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!existUser.isActive) {
      throw new BadRequestException('verify email first');
    }

    const isPasswordEqual = await bcrypt.compare(password, existUser.password);
    if (!isPasswordEqual) {
      throw new BadRequestException('invalid credentials');
    }
    const payload = {
      id: existUser._id,
      role: existUser.role,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return {
      message: 'sign in successful',
      token,
      role: existUser.role,
    };
  }
  async getCurrentUser(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      _id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
