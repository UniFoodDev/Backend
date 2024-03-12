import {
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne
  } from 'typeorm';
  import { User } from './../../user/entities/user.entity';
  import { CartItem } from './cartItem.entity';
  
  @Entity()
  export class Cart {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User, (user) => user.orders)
    user: User;
  
    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    public cartItem!: CartItem[];
  }