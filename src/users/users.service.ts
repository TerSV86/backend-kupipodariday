import {
  /* BadRequestException, */ Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
/* import * as bcrypt from 'bcrypt'; */
import { hashValue } from 'src/helpers/hash';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => WishesService))
    private readonly wishesService: WishesService,
  ) {}

  /* async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser)
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    const salt = 10;
    const user = await this.userRepository.save({
      email: createUserDto.email,
      username: createUserDto.username,
      about: createUserDto.about,
      password: await bcrypt.hash(createUserDto.password, salt),
      avatar: createUserDto.avatar,
    });
    return user;
  } */

  async signup(createUserDto: CreateUserDto): Promise<User> {
    /* console.log('singup', createUserDto); */

    const { password } = createUserDto;
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.userRepository.save(user);
  }

  async findOne(query: FindOneOptions<User>) {
    /* console.log('userservice-findone', query); */
    return this.userRepository.findOneOrFail(query);
  }
  //используется в сервисе авторизации
  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    /* console.log('UserServer-findByid', user, id); */

    return await this.userRepository.findOneBy({ id });
  }

  async findUserName(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    /* console.log('userservice-findUserName', user); */
    return user;
  }

  async findUserWishes(username: string) {
    const userId = (await this.userRepository.findOne({ where: { username } }))
      .id;
    const user = await this.wishesService.findUserId(userId);
    return user;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const userDB = await this.userRepository.findOneOrFail({
      where: { id: user.id },
    });

    const { email, username, about, avatar, password } = updateUserDto;

    // Проверяем уникальность email
    if (email && email !== userDB.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email },
      });
      if (emailExists) {
        throw new Error('Пользователь с таким email уже существует');
      }
    }

    // Проверяем уникальность username
    if (username && username !== userDB.username) {
      const usernameExists = await this.userRepository.findOne({
        where: { username },
      });
      if (usernameExists) {
        throw new Error('Пользователь с таким именем уже существует');
      }
    }
    let hashPassword;
    if (password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      hashPassword = await hashValue(password);
    }

    // Обновляем поля
    const updatedUser = {
      ...userDB,
      email: email || userDB.email,
      username: username || userDB.username,
      about: about || userDB.about,
      avatar: avatar || userDB.avatar,
      password: hashPassword || userDB.password,
    };
    /*  console.log('updateUser', updatedUser); */

    return this.userRepository.save(updatedUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
