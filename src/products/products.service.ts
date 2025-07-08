import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { price, quantity } = createProductDto;
    const createdProduct = await this.productModel.create({ price, quantity });
    return {
      message: 'product created successfully',
      product: createdProduct,
    };
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new BadRequestException('Product Does Not Exist');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProduct) {
      throw new BadRequestException('Product does not exist');
    }
    return {
      message: 'product updated successfully',
      product: updatedProduct,
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const deleteProduct = await this.productModel.findByIdAndDelete(id);
    if (!deleteProduct) {
      throw new BadRequestException('Product does not exist');
    }
    return {
      message: 'product deleted successfully',
      product: deleteProduct.toJSON(),
    };
  }
}
