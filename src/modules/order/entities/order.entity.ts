import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../../../enums/orderStatus.enum';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './orderItem.entity';
import { PaymentType } from 'src/enums/payment-type.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: false, default: 0 })
  shippingCost: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderStatus,
    default: OrderStatus.Processing,
  })
  orderStatus: OrderStatus;

  @Column({ nullable: false })
  totalPrice: number;

  @Column({ 
    nullable: false, 
    default: [PaymentType.COD],     
    type: 'enum', 
    enum: PaymentType
  })
  paymentMethod: PaymentType;

  @Column({
    nullable: false,
    default: false
  })
  isPaid: boolean;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  public orderItems!: OrderItem[];

  @Column({ nullable: true, type: 'timestamp with time zone' })
  paidDate: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedDate: Date;
}
