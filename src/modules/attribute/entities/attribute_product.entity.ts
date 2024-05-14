import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Column, ManyToOne } from 'typeorm';
import { Attribute } from './attribute.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class AttributeProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, (attribute) => attribute.attributeProducts)
  attribute: Attribute;

  @ManyToOne(() => Product, (product) => product.attributeProducts)
  product: Product;
}
