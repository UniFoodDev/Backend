import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { AttributeValueVariant } from './attribute_value_variant.entity';

@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  value: string;

  @Column({ nullable: false })
  price: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.attributeValues, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  attribute: Attribute;

  @OneToMany(
    () => AttributeValueVariant,
    (attributeValueVariant) => attributeValueVariant.attributeValue,
  )
  attributeValueVariant: AttributeValueVariant[];
}
