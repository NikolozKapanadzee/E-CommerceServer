import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  get total(): number {
    return this.price * this.quantity;
  }
}
