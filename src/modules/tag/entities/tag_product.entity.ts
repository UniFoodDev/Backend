import { Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../database';
import { Tag } from './tag.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class TagProduct extends AbstractEntity {
  @ManyToOne(() => Tag, (tag) => tag.tag_product)
  tag: Tag;

  @ManyToOne(() => Product, (product) => product.tag_product)
  product: Product;
}
