import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { Wish } from './entities/wish.entity';

@UseGuards(JWTAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @AuthUser() user: User,
  ): Promise<Wish> {
    return await this.wishesService.createWish(createWishDto, user.id);
  }

  // более конкретные маршруты должны быть выше общих
  @Get('last')
  async findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  async findTop(): Promise<Wish[]> {
    return this.wishesService.findTopWish();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.findOne(id, user.id);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.copy(+id, user);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.removeWish(+id, user);
  }
}
