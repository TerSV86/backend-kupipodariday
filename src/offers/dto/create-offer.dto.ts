import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(2)), {
    toClassOnly: true,
  })
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
