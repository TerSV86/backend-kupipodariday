import { IsEmpty, IsInt, IsUrl, Length, Min } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'varchar', length: 250 })
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  @IsEmpty()
  raised: number;

  @ManyToOne(() => User, (user) => user.wihses)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @Column({ type: 'varchar', length: 1024 })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  copied: number;
}
