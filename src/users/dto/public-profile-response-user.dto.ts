import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UserPublicProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsOptional()
  @Length(1, 200)
  about: string;

  @Expose()
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
