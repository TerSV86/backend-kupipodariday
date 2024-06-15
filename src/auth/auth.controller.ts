import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpExceptionFilter } from 'src/filters/HttpException.filter';

@Controller()
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@AuthUser() user): Promise<any> {
    const token = await this.authService.login(user);
    if (token) return token;
  }

  @Post('signup')
  async singup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.signup(createUserDto);
    return user;
  }
}
