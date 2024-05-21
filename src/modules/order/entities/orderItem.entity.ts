import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from '../../variant/entities/variant.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  orderedPrice: string;

  @ManyToOne(() => Order, (order) => order.orderItems)
  public order!: Order;

  @ManyToOne(() => Variant, (variant) => variant.orderItems)
  public variant!: Variant;
}
