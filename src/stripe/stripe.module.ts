import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/stripe.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: TransactionSchema, name: Transaction.name },
      { schema: UserSchema, name: User.name },
    ]),
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
