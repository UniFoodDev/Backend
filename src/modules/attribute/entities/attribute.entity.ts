import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AttributeValue } from '../../attribute-value/entities/attribute-value.entity';
import { AttributeProduct } from './attribute_product.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  multiSelect: boolean;

  @Column({ nullable: false })
  required: boolean;

  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.attribute)
  public attributeValues!: AttributeValue[];

  @OneToMany(
    () => AttributeProduct,
    (attributeProduct) => attributeProduct.attribute,
  )
  public attributeProducts!: AttributeProduct[];
}
