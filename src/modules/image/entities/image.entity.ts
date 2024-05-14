import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  publicId: string;

  @Column({ nullable: false })
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  product: Product;

  @ManyToOne(() => Category, (category) => category.images, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  category: Category;
}
