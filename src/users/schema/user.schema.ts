import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'product',
    default: [],
  })
  products: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
