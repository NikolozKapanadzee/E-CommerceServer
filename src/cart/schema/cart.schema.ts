import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/schema/user.schema';

@Schema({ _id: true })
export class CartItem {
  @Prop({
    min: 1,
    required: true,
    type: Number,
  })
  quantity: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Product.name,
  })
  productId: mongoose.Types.ObjectId;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({
    type: [CartItemSchema],
    default: [],
  })
  items: CartItem[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  author: mongoose.Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
