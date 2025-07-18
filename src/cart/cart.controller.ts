import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UserId } from 'src/common/decorator/user.decorator';
import { IsAuthGuard } from 'src/common/guard/isAuth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(IsAuthGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto, @UserId() userId: string) {
    return this.cartService.create(createCartDto, userId);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Put(':id/remove-items')
  removeItems(
    @Param('id') cartId: string,
    @Body('productIds') productIds: string[],
  ) {
    return this.cartService.removeItemsFromCart(cartId, productIds);
  }
  @Get(':id/items/:productId')
  getItemFromCart(
    @Param('id') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.getItemFromCart(cartId, productId);
  }
}
