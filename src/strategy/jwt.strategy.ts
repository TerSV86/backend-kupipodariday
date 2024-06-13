import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
/* import { Strategy } from 'passport-local'; */
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(JwtStrategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      // считывает заголовки
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,
      // соль
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    /* console.log('JWTStrategy', payload); */
    return this.userService.findById(payload.sub);
  }
}
