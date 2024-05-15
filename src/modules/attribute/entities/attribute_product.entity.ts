import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Attribute } from './attribute.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class AttributeProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, (attribute) => attribute.attributeProducts, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  attribute: Attribute;

  @ManyToOne(() => Product, (product) => product.attributeProducts, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  product: Product;
}
