import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../../../enums/role.enum';
import { Order } from '../../order/entities/order.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { AbstractEntity } from '../../../database';
import { Address } from './address.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  passwordCode: string;

  @Column({ nullable: true })
  passwordCodeExpired: Date;

  @Column({
    type: 'enum',
    enum: Role,
    array: true, // Use array for PostgreSQL enums
    default: [Role.Guest],
  })
  roles: Role[];

  @Column({
    type: 'boolean',
    default: false,
  })
  isAccountBanned: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
