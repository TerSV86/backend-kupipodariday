import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { OffersService } from 'src/offers/offers.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishesRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => OffersService))
    private readonly offersService: OffersService,
  ) {}

  async createWish(createWishDto: CreateWishDto, id: number): Promise<Wish> {
    const owner = await this.usersService.findById(id);
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner,
    });
    /* console.log('wishesService', createWishDto); */
    return this.wishesRepository.save(wish);
  }

  async findWishById(user_id: number): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id: user_id } },
      relations: ['owner', 'offers'],
    });
    return wishes;
  }

  findAll() {
    return `This action returns all wishes`;
  }

  async findOne(wishId: string, user_id: number): Promise<any> {
    const id: number = parseInt(wishId, 10);
    /* console.log(wishId, user_id); */

    const user = await this.usersService.findById(user_id);
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    /* console.log('WishesService-findOne', user, wish); */
    const transformedOffers = wish.offers.map((offer) => ({
      ...offer,
      name: offer.user.username,
      createdAt: wish.createdAt.toISOString().split('T')[0],
    }));

    return { ...wish, offers: transformedOffers };
  }

  async findLast(): Promise<any> {
    const lastWish = await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['owner', 'offers'],
    });
    return lastWish;
  }

  async findTopWish(): Promise<any> {
    const topWish = await this.wishesRepository.find({
      order: { copied: 'ASC' },
      relations: ['owner', 'offers'],
    });
    return topWish;
  }

  findById(id: number): any {
    return this.wishesRepository.findOneBy({ id });
  }

  async findUserId(userId: number): Promise<any> {
    return await this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations: [
        'offers',
        'offers.user',
        'offers.item',
        'offers.item.owner',
        'offers.user.wishlist',
      ],
    });
  }

  async updateRaised(raised: number, wish: Wish) {
    wish.raised = raised;
    return this.wishesRepository.save(wish);
  }

  async copy(id: number, user: User) {
    const owner = await this.usersService.findById(user.id)
    const wish = await this.wishesRepository.findOneByOrFail({ id });
    const { description, image, link, name, price } = wish;
    const copyWish = this.wishesRepository.create({
      description,
      image,
      link,
      name,
      price,
      owner,
    });
    return this.wishesRepository.save(copyWish);
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
