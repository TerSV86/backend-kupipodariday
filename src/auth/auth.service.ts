import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashValue, verifyHash } from 'src/helpers/hash';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    /* console.log('validateuser', username, password); */

    const user = await this.usersService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });
    /* console.log('authservice', user); */

    if (user && (await verifyHash(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      console.log(user, result);

      return result;
    } else {
      throw new HttpException('Некорректная пара логин и пароль', 401);
    }
    /* console.log('tyt'); */

    return null;
  }

  async login(user: User) {
    const { username, id: sub } = user;
    const access_token = {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
    console.log('auth', user, access_token);
    return access_token;
  }
}
