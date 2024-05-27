import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Module } from '@nestjs/common/decorators';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
