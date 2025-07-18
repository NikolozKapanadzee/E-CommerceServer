import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNotEmpty,
  Min,
  IsNumber,
} from 'class-validator';
class CartItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
export class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
