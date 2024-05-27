import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
/* import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module'; */
import { Wish } from './wishes/entities/wish.entity';
import { User } from './users/entities/user.entity';
import { Module } from '@nestjs/common/decorators';
import { Offer } from './offers/entities/offer.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';

@Module({
  imports: [
    //устанавливаем соединение с базой
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'nest_kupipodariday_project',
      entities: [User, Wish, Offer, Wishlist], //сущности, которые описывают базу данных.
      synchronize: true, //подгоняeт базу в СУБД к той, что описана в ORM.
    }),
    TypeOrmModule.forFeature([User, Wish, Offer, Wishlist]), //обеспечивает доступ к сущностям User, Wish, Offer, Wishlist в AppModule
    UsersModule,
    WishesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
