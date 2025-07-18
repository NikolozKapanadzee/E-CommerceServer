import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { isValidObjectId, Model } from 'mongoose';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async create(createCartDto: CreateCartDto, userId: string) {
    for (const item of createCartDto.items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
    }

    const cartData = {
      author: userId,
      items: createCartDto.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    const createdCart = await this.cartModel.create(cartData);
    const populatedCreatedCart = await this.cartModel
      .findById(createdCart._id)
      .populate('author', 'email role')
      .populate('items.productId')
      .exec();
    return {
      message: 'Cart created successfully',
      data: populatedCreatedCart,
    };
  }

  async findAll() {
    const carts = await this.cartModel.find();
    if (!carts) {
      throw new NotFoundException('nothing found');
    }
    return carts;
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid ID format');
    }
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException('nothing found');
    }
    return cart;
  }
  async update(id: string, updateCartDto: UpdateCartDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid ID format');
    }

    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    if (!updateCartDto.items) {
      throw new BadRequestException('No items provided to update');
    }
    for (const item of updateCartDto.items) {
      await this.cartModel.updateOne(
        { _id: id, 'items.productId': item.productId },
        { $set: { 'items.$.quantity': item.quantity } },
      );
    }
    const updatedCart = await this.cartModel
      .findById(id)
      .populate('items.productId');

    return {
      message: 'Cart updated successfully',
      data: updatedCart,
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid ID format');
    }
    const deletedCart = await this.cartModel.findByIdAndDelete(id);
    if (!deletedCart) {
      throw new NotFoundException('cart not found');
    }
    return {
      message: 'cart deleted successfully',
      data: deletedCart,
    };
  }
  async removeItemsFromCart(cartId: string, productIds: string[]) {
    if (!isValidObjectId(cartId)) {
      throw new BadRequestException('invalid  ID format');
    }
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const updatedCart = await this.cartModel
      .findByIdAndUpdate(
        cartId,
        {
          $pull: {
            items: {
              productId: { $in: productIds },
            },
          },
        },
        { new: true },
      )
      .populate('items.productId');
    return {
      message: 'Item removed from cart',
      data: updatedCart,
    };
  }

  async getItemFromCart(cartId: string, productId: string) {
    if (!isValidObjectId(cartId)) {
      throw new BadRequestException('invalid cart ID format');
    }
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('invalid product ID format');
    }
    const cart = await this.cartModel
      .findById(cartId)
      .populate('items.productId')
      .exec();

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    let item = cart.items.find(
      (item) => item.productId._id.toString() === productId,
    );
    if (!item) {
      item = cart.items.find(
        (item) => (item as any)._id.toString() === productId,
      );
    }
    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }
    return {
      message: 'Item fetched successfully',
      data: item,
    };
  }
}
