import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { resOffers } from 'src/utils/data';

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

  async create(createOfferDto: CreateOfferDto, userID: number) {
    const user = await this.usersService.findById(userID);
    const wish = await this.wishesService.findOne(
      `${createOfferDto.itemId}`,
      user.id,
    );
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете внести взнос в собственный подарок',
      );
    }
    const raisedWish = await this.offersRepository
      .createQueryBuilder('offer')
      .select('SUM(offer.amount)', 'sum')
      .where('offer.itemId = :wishId', { wishId: createOfferDto.itemId })
      .getRawOne();
    const calculateRaised = +raisedWish.sum + createOfferDto.amount;
    if (calculateRaised > wish.price) {
      throw new ForbiddenException(
        'Ваш взнос не должен привышать стоимость подарка',
      );
    }
    const offer = await this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });
    this.wishesService.updateRaised(calculateRaised, wish);
    return this.offersRepository.save(offer);
  }

  findAll() {
    return this.offersRepository.find(resOffers);
  }

  findOne(id: number) {
    return this.offersRepository.findOne({
      where: { id },
      ...resOffers,
    });
  }
}
