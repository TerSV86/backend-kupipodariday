import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user_id: number) {
    const user = await this.usersService.findById(user_id);
    const arrWishlist = await Promise.all(
      createWishlistDto.itemsId.map((id) => this.wishService.findById(id)),
    );
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: arrWishlist,
    });
    return this.wishlistRepository.save(wishlist);
  }

  findAll() {
    return `This action returns all wishlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
