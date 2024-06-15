import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Offer } from './entities/offer.entity';

@UseGuards(JWTAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @AuthUser() user: User,
  ): Promise<Offer> {
    return this.offersService.create(createOfferDto, user.id);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(+id);
  }
}
