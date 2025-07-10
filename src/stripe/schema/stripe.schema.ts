import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Status } from 'src/common/enum/status.enum';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
  })
  sessionId: string;

  @Prop({
    type: Number,
  })
  amount: number;

  @Prop({
    enum: Status,
    default: Status.PENDING,
  })
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
