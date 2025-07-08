import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: Number,
    required: true,
  })
  price: number;
  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;
  //   @Prop({
  //     type: Number,
  //     required: true,
  //   })
  //   total: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  author: mongoose.Schema.Types.ObjectId;
}

export const ProductsSchema = SchemaFactory.createForClass(Product);

ProductsSchema.virtual('total').get(function () {
  return this.price * this.quantity;
});
ProductsSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    delete ret.id;
    return ret;
  },
});

ProductsSchema.set('toObject', { virtuals: true });
