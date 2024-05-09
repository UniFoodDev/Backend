import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../../enums/role.enum';
import { Order } from '../../order/entities/order.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  @Exclude()
  password: string; // password nay ko hash ??

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

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  }) // Adjusting date columns for PostgreSQL
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  }) // Adjusting date columns for PostgreSQL
  updatedDate: Date;
}
