import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Module } from '@nestjs/common/decorators';
import { UsersModule } from 'src/users/users.module';
import { forwardRef } from '@nestjs/common';
import { OffersModule } from 'src/offers/offers.module';
import { Offer } from 'src/offers/entities/offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish, Offer]),
    forwardRef(() => UsersModule),
    forwardRef(() => OffersModule),
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {
  static forRoot(): import("@nestjs/common").Type<any> | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule> | import("@nestjs/common").ForwardReference<any> {
    throw new Error('Method not implemented.');
  }
}
