import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';

export class UserWishesDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsNumber()
  raised: number;

  @IsNumber()
  copied: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsArray()
  offers: Offer[];
}
