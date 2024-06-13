import { IsInt, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 1024)
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsInt()
  price: number;
}
