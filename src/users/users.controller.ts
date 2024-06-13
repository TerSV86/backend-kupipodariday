import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  /* Post, */
  UseGuards,
} from '@nestjs/common/decorators';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { FindOneOptions } from 'typeorm';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';
/* import { CreateUserDto } from './dto/create-user.dto'; */

@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) { }

  /* @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.signup(createUserDto);
  } */

  @Get('me')
  async findOwn(@AuthUser() user: User): Promise<User> {
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
    /* console.log('me', user.id, query); */
    return this.usersService.findOne(query);
  }

  @Patch('me')
  update(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    /* console.log('UpdateUser', updateUserDto); */
    
    return this.usersService.update(user, updateUserDto);
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
  async findUserWishes(@Param() param: { username: string }): Promise<any> {
    const { username } = param;
    return await this.usersService.findUserWishes(username);
  }
}
