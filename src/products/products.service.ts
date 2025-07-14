import { BadRequestException, Injectable, Param } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { isValidObjectId, Model } from 'mongoose';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private awsService: AwsS3Service,
  ) {}

  async deleteFileById(fileId: string) {
    return this.awsService.deleteFileById(fileId);
  }

  async getFileById(fileId: string) {
    return this.awsService.getFileById(fileId);
  }

  async uploadFile(file: Express.Multer.File) {
    const fileType = file.mimetype.split('/')[1];
    const fileId = `images/${uuidv4()}.${fileType}`;
    await this.awsService.uploadFile(fileId, file);
    return fileId;
  }
  async uploadFiles(files: Express.Multer.File[]) {
    const uploadFileIds: string[] = [];
    for (const file of files) {
      const fileType = file.mimetype.split('/')[1];
      const fileId = `images/${uuidv4()}.${fileType}`;
      await this.awsService.uploadFile(fileId, files);
      uploadFileIds.push(fileId);
    }
    return uploadFileIds;
  }

  async create(createProductDto: CreateProductDto, userId: string) {
    const createdProduct = await this.productModel.create({
      ...createProductDto,
      author: userId,
    });
    return {
      message: 'product created successfully',
      product: createdProduct,
    };
  }

  async findAll() {
    return this.productModel.find().populate('author', 'email role');
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const product = await this.productModel
      .findById(id)
      .populate('author', 'email role');
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
