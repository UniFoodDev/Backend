import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Image } from '../../image/entities/image.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    nullable: true,
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Image, (image) => image.category)
  images: Image[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
