import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Transaction } from './schema/stripe.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY!);
  }
  async createPayment(userEmail: string, priceId, quantity) {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user?._id) {
      throw new BadRequestException('User not found');
    }

    const customerId = user.stripeCustomerId
      ? user.stripeCustomerId
      : await this.createStripeCutomerId(user._id, user.email);
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONT_URL}?type=success`,
      cancel_url: `${process.env.FRONT_URL}?type=cancel`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    await this.transactionModel.create({
      sessionId: session.id,
      userId: user._id,
      amount: session.amount_total ? session.amount_total / 100 : 0,
    });

    return { url: session.url };
  }

  async createStripeCutomerId(userId, userEmail) {
    const customer = await this.stripe.customers.create({ email: userEmail });
    await this.userModel.findByIdAndUpdate(
      userId,
      { stripeCustomerId: customer.id },
      { new: true },
    );
    return customer.id;
  }
}
