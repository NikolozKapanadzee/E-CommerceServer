import { IsOptional, IsString } from 'class-validator';

export class FilterProductsDTO {
  @IsOptional()
  @IsString()
  category: string;
}
