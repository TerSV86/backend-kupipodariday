import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashValue } from 'src/helpers/hash';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => WishesService))
    private readonly wishesService: WishesService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, username } = createUserDto;
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    if (user && !existingEmail && !existingUsername)
      return this.userRepository.save(user);
    else {
      throw new HttpException(
        'Пользователь с таким email или username уже зарегистрирован',
        409,
      );
    }
  }

  async findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(query);
  }
  //используется в сервисе авторизации
  async findById(id: number) {
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
    return user;
  }

  async findUserWishes(username: string) {
    const userId = (await this.userRepository.findOne({ where: { username } }))
      .id;
    const userWishes = await this.wishesService.findUserId(userId);
    return userWishes;
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
        throw new HttpException(
          'Пользователь с таким email уже существует',
          400,
        );
      }
    }
    // Проверяем уникальность username
    if (username && username !== userDB.username) {
      const usernameExists = await this.userRepository.findOne({
        where: { username },
      });
      if (usernameExists) {
        throw new HttpException(
          'Пользователь с таким именем уже существует',
          400,
        );
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
    await this.userRepository.save(updatedUser);
    const res: FindOneOptions<User> = {
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

    return this.userRepository.findOne(res);
  }

  async findByQuery(query: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
    return users;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
