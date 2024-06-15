import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';

@UseGuards(JWTAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @Get()
  findWishlist(@AuthUser() user: User): Promise<Wishlist[]> {
    return this.wishlistsService.findWishlist(user);
  }

  @Get(':id')
  findWishes(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findWishes(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.updateWishlist(+id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.remove(+id);
  }
}
