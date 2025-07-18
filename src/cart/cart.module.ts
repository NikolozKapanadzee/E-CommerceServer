import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductsSchema } from 'src/products/schema/product.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Cart, CartSchema } from './schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductsSchema },
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
