import {
  Body,
  Controller,
  Headers,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentDto } from './dto/create-payment.dto';
import { UserId } from 'src/common/decorator/user.decorator';
import { IsAuthGuard } from 'src/common/guard/isAuth.guard';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout')
  @UseGuards(IsAuthGuard)
  createCheckout(
    @UserId() userId: string,
    @Body() { priceId, quantity }: PaymentDto,
  ) {
    return this.stripeService.createPayment(userId, priceId, quantity);
  }

  @Post('webhook')
  webHook(@Req() req: Request, @Headers() headers: Record<string, string>) {
    return this.stripeService.webHook((req as any).rawBody, headers);
  }
}
