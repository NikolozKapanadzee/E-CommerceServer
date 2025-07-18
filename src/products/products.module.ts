import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductsSchema } from './schema/product.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { AwsS3Module } from 'src/aws/aws-s3.module';

@Module({
  imports: [
    AwsS3Module,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
