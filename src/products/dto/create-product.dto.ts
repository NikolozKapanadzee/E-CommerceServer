import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  @IsString()
  category: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsArray()
  @IsString({ each: true })
  img: string[];
}
