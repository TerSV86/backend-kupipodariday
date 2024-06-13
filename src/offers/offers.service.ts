import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => WishesService))
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    userID: number /* item: string */,
  ) {
    /* console.log('OffersService', createOfferDto, user); */
    const user = await this.usersService.findById(userID);
    const wish = await this.wishesService.findOne(
      `${createOfferDto.itemId}`,
      user.id,
    );
    const raisedWish = await this.offersRepository
      .createQueryBuilder('offer')
      .select('SUM(offer.amount)', 'sum')
      .where('offer.itemId = :wishId', { wishId: createOfferDto.itemId })
      .getRawOne();
    const calculateRaised = +raisedWish.sum + createOfferDto.amount;
    const offer = await this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });
    /* console.log('OffersService', offer); */
    this.wishesService.updateRaised(calculateRaised, wish);
    return this.offersRepository.save(offer);
  }

  findAll(id: number) {
    return this.offersRepository.find({
      where: { item: { id } },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
