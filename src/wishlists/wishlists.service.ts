import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

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
    console.log('arrWishlist', arrWishlist);
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: [...arrWishlist],
    });
    console.log(wishlist);

    return this.wishlistRepository.save(wishlist);
  }

  async findWishlist(user: User) {
    const wishlist = await this.wishlistRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner', 'items'],
    });
    return wishlist;
  }

  async findWishes(id: number) {
    return await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['owner', 'items'],
    });
  }

  async updateWishlist(id: number, updateWishlistDto: UpdateWishlistDto) {
    const { name, image, itemsId } = updateWishlistDto;
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    console.log('updateWishlist', updateWishlistDto), wishlist;
    let newItemsWishlist;
    if (itemsId) {
      newItemsWishlist = await Promise.all(
        updateWishlistDto.itemsId.map((id) => this.wishService.findById(id)),
      );
    }
    const updateWishlist = {
      ...wishlist,
      name: name || wishlist.name,
      image: image || wishlist.image,
      items: newItemsWishlist || wishlist.items,
    };
    console.log('updateWishlist', updateWishlist);

    return this.wishlistRepository.save(updateWishlist);
  }

  async remove(id: number) {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });
    return await this.wishlistRepository.remove(wishlist);
  }
}
