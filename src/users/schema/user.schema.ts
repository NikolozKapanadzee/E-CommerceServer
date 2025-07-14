import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/common/enum/roles.enum';

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
    type: String,
  })
  stripeCustomerId: string;

  @Prop({
    required: true,
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
