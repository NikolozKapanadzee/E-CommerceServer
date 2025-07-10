import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentDto } from './dto/create-payment.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout')
  createCheckout(@Body() { email, priceId, quantity }: PaymentDto) {
    return this.stripeService.createPayment(email, priceId, quantity);
  }
}
