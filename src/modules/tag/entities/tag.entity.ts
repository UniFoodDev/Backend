import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../database';
import { TagProduct } from './tag_product.entity';

@Entity()
export class Tag extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => TagProduct, (tagProduct) => tagProduct.tag)
  tag_product: TagProduct[];
}
