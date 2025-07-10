import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  priceId: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  quantity: number;
}
