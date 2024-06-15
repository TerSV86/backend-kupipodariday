import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UserProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsOptional()
  @Length(2, 200)
  about?: string;

  @Expose()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
