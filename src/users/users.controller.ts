import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Body,
  Post,
  Controller,
  Get,
  Param,
  Patch,
  /* Post, */
  UseGuards,
  UseFilters,
} from '@nestjs/common/decorators';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { FindOneOptions } from 'typeorm';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { FindUsersDto } from './dto/query-user.dto';
import { UserProfileResponseDto } from './dto/profile-respons-user.dto';
import { UserWishesDto } from './dto/wishes-user.dto';
import { UserPublicProfileResponseDto } from './dto/public-profile-response-user.dto';
import { HttpExceptionFilter } from 'src/filters/HttpException.filter';
import { HttpException } from '@nestjs/common';

@UseGuards(JWTAuthGuard)
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async findOwn(@AuthUser() user: User): Promise<UserProfileResponseDto> {
    const query: FindOneOptions<User> = {
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        about: true,
      },
    };
    return this.usersService.findOne(query);
  }

  @Patch('me')
  async update(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const updateUser = await this.usersService.update(user, updateUserDto);
    if (updateUser) return updateUser;
    else {
      throw new HttpException('Пользователя не существует', 400);
    }
  }

  @Get('me/wishes')
  async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.wishesService.findWishById(user.id);
  }

  //надо написать запрос по этому маршруту
  /*  @Post('find') */

  @Get(':username')
  async findUser(@Param() param: { username: string }): Promise<User> {
    const { username } = param;
    return await this.usersService.findUserName(username);
  }

  @Get(':username/wishes')
  async findUserWishes(
    @Param() param: { username: string },
  ): Promise<UserWishesDto[]> {
    const { username } = param;
    return await this.usersService.findUserWishes(username);
  }

  @Post('find')
  async findByQuery(
    @Body() body: FindUsersDto,
  ): Promise<UserPublicProfileResponseDto[]> {
    return await this.usersService.findByQuery(body.query);
  }
}
