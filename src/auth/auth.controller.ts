import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@AuthUser() user): Promise<any> {
    /* console.log('authcontr', user); */
    return this.authService.login(user);
  }

  @Post('signup')
  async singup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.signup(createUserDto);
    return user;
  }
}
