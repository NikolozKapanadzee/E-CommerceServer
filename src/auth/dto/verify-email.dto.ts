import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsNumber()
  otpCode: number;
}
