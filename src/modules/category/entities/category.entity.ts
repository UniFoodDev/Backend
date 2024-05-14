import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { AbstractEntity } from '../../../database';
import { Image } from '../../image/entities/image.entity';

@Entity()
export class Category extends AbstractEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Image, (image) => image.category)
  images: Image[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
