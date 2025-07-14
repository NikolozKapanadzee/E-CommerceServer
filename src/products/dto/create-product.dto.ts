import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsNotEmpty()
  @IsString()
  img: string;
  get total(): number {
    return this.price * this.quantity;
  }
}
