import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from './../../variant/entities/variant.entity';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public cartId!: number;

  @Column()
  public variantId!: number;

  @Column({ nullable: false })
  orderedQuantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItem)
  public cart!: Cart;

  @ManyToOne(() => Variant, (variant) => variant.cartItems)
  public variant!: Variant;
}