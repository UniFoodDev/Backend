import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from '../../order/entities/orderItem.entity';
import { CartItem } from '../../cart/entities/cartItem.entity';
import { Product } from '../../product/entities/product.entity';
import { AttributeValueVariant } from '../../attribute-value/entities/attribute_value_variant.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  price: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  product: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.variant)
  public orderItems!: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.variant)
  public cartItems!: CartItem[];

  @OneToMany(
    () => AttributeValueVariant,
    (attributeValueVariant) => attributeValueVariant.variant,
  )
  attributeValueVariant: AttributeValueVariant[];
}
