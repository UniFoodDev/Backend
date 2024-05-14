import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from '../../variant/entities/variant.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public orderId!: number;

  @Column()
  public variantId!: number;

  @Column({ nullable: false })
  orderedPrice: string;

  @Column({ nullable: false })
  orderedQuantity: string;

  @ManyToOne(() => Order, (order) => order.orderItems)
  public order!: Order;

  @ManyToOne(() => Variant, (variant) => variant.orderItems)
  public variant!: Variant;
}
