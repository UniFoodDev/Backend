import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Image } from '../../image/entities/image.entity';
import { Variant } from '../../variant/entities/variant.entity';
import { AbstractEntity } from '../../../database';
import { TagProduct } from '../../tag/entities/tag_product.entity';
import { AttributeProduct } from '../../attribute/entities/attribute_product.entity';

@Entity()
export class Product extends AbstractEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false })
  price: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false, default: 5 })
  rating: number;

  @Column({ nullable: false })
  discount: number;

  @Column({ nullable: false })
  sales: number;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => Category, (category) => category.products, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  category: Category;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => TagProduct, (tagProduct) => tagProduct.product)
  tag_product: TagProduct[];

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  @OneToMany(
    () => AttributeProduct,
    (attributeProduct) => attributeProduct.product,
  )
  attributeProducts: AttributeProduct[];
}
