import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { query } from 'express';
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
    /* console.log('WishesLast'); */
    return this.wishesService.findLast();
  }

  @Get('top')
  async findTop(): Promise<Wish[]> {
    return this.wishesService.findTopWish();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: User) {
    /* console.log('WishesController', id, user); */
    return this.wishesService.findOne(id, user.id);
  }

  /* @Patch(':id')
  update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(id, updateWishDto);
  } */

  @Post(':id/copy')
  copyWish(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.copy(+id, user);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.removeWish(+id, user);
  }
}
