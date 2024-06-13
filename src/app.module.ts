import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
/* import { Wish } from './wishes/entities/wish.entity'; */
/* import { User } from './users/entities/user.entity'; */
import { Module } from '@nestjs/common/decorators';
/* import { Offer } from './offers/entities/offer.entity'; */
/* import { Wishlist } from './wishlists/entities/wishlist.entity'; */
import { OffersModule } from './offers/offers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    //устанавливаем соединение с базой
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServives: ConfigService) => ({
        type: 'postgres',
        host: configServives.get<string>('DB_HOST'),
        port: configServives.get<number>('DB_PORT'),
        username: configServives.get<string>('DB_USERNAME'),
        password: configServives.get<string>('DB_PASSWORD'),
        database: configServives.get<string>('DB_NAME'),
        entities: [
          __dirname +
            '/**/*.entity{.js, .ts}' /* User, Wish, Offer, Wishlist */,
        ], //сущности, которые описывают базу данных.
        synchronize: true, //подгоняeт базу в СУБД к той, что описана в ORM.
      }),
      inject: [ConfigService],
    }),
    /*  TypeOrmModule.forFeature([User, Wish, Offer, Wishlist]), */ //обеспечивает доступ к сущностям User, Wish, Offer, Wishlist в AppModule
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
