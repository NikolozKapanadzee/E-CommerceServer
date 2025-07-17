import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
