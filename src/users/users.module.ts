import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Module } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WishesModule } from 'src/wishes/wishes.module';
import { Offer } from 'src/offers/entities/offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Offer]),
    forwardRef(() => AuthModule),
    forwardRef(() => WishesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
