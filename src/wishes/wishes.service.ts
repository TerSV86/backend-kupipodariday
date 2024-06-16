import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { OffersService } from 'src/offers/offers.service';
import { User } from 'src/users/entities/user.entity';
import { resUser } from 'src/utils/data';

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
    return this.wishesRepository.save(wish);
  }

  async findWishById(user_id: number): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id: user_id } },
    });
    return wishes;
  }

  findAll() {
    return `This action returns all wishes`;
  }

  async findOne(wishId: string, user_id: number): Promise<any> {
    const id: number = parseInt(wishId, 10);
    const user = await this.usersService.findById(user_id);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
      select: {
        owner: resUser,
        offers: {
          id: true,
          createdAt: true,
          updatedAt: true,
          amount: true,
          hidden: true,
          user: resUser,
        },
      },
    });
    //frontend использует name а не username
    const transformedOffers = wish.offers.map((offer) => ({
      ...offer,
      name: offer.user.username,
      createdAt: wish.createdAt.toISOString().split('T')[0],
    }));
    const transformWish = { ...wish, offers: transformedOffers };
    return transformWish;
  }

  async findLast(): Promise<Wish[]> {
    const lastWish = await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['owner', 'offers'],
      select: {
        owner: resUser,
      },
      take: 40,
    });
    return lastWish;
  }

  async findTopWish(): Promise<Wish[]> {
    const topWish = await this.wishesRepository.find({
      order: { copied: 'DESC' },
      relations: ['owner', 'offers'],
      select: {
        owner: resUser,
      },
      take: 20,
    });
    return topWish;
  }

  findById(id: number): any {
    return this.wishesRepository.findOneBy({ id });
  }

  async findUserId(userId: number): Promise<Wish[]> {
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

  async updateRaised(raised: number, wish: Wish): Promise<Wish> {
    wish.raised = raised;
    return this.wishesRepository.save(wish);
  }

  async copy(id: number, user: User): Promise<Wish> {
    const queryRunner =
      this.wishesRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const owner = await this.usersService.findOne({
        where: { id: user.id },
        relations: ['wihses'],
      });

      if (!owner) {
        throw new Error('Пользователь не найден');
      }
      const wish = await this.wishesRepository.findOneByOrFail({ id });
      const existingCopy = await this.wishesRepository.findOne({
        where: { owner: { id: user.id }, name: wish.name, link: wish.link },
      });

      if (existingCopy) {
        throw new HttpException('Вы уже копировали себе этот подарок', 409);
      }
      const { description, image, link, name, price } = wish;
      const copyWish = this.wishesRepository.create({
        description,
        image,
        link,
        name,
        price,
        owner,
      });

      wish.copied += 1;
      await queryRunner.manager.save(wish);
      const savedCopy = await queryRunner.manager.save(copyWish);

      await queryRunner.commitTransaction();
      return savedCopy;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeWish(id: number, user: User): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалить чужую карточку');
    }
    return await this.wishesRepository.remove(wish);
  }
}
