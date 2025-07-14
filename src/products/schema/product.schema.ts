import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
  })
  description: string;
  @Prop({
    type: String,
    required: true,
  })
  category: string;
  @Prop({
    type: String,
    required: true,
  })
  itemName: string;
  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;
  @Prop({
    type: [String],
    required: true,
  })
  img: string[];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author: mongoose.Schema.Types.ObjectId;
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
