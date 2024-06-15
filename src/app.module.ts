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
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winstonConfig';

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
        entities: [__dirname + '/**/*.entity{.js, .ts}'], //сущности, которые описывают базу данных.
        synchronize: true, //подгоняeт базу в СУБД к той, что описана в ORM.
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    AuthModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
