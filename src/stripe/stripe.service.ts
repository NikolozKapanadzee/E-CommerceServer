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
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY!);
  }

  async createPayment(userId: string, priceId: string, quantity: number) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const customerId = user.stripeCustomerId
      ? user.stripeCustomerId
      : await this.createStripeCustomerId(user._id.toString(), user.email);

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity,
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
      status: 'pending',
    });

    return { url: session.url };
  }

  private async createStripeCustomerId(
    userId: string,
    userEmail: string,
  ): Promise<string> {
    const customer = await this.stripe.customers.create({ email: userEmail });
    await this.userModel.findByIdAndUpdate(
      userId,
      { stripeCustomerId: customer.id },
      { new: true },
    );
    return customer.id;
  }

  async webHook(
    rawBody: Buffer,
    headers: Record<string, string>,
  ): Promise<{ received: boolean }> {
    const sig = headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_KEY!,
      );
    } catch (err) {
      console.error('Stripe webhook signature error:', err);
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (session.payment_status === 'paid' && userId) {
          await this.transactionModel.findOneAndUpdate(
            { sessionId: session.id },
            { status: 'completed' },
          );
          console.log(`✅ Payment completed for user: ${userId}`);
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent succeeded: ${intent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
