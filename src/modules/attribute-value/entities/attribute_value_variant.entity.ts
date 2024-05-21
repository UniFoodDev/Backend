import { PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { AttributeValue } from './attribute-value.entity';
import { Variant } from '../../variant/entities/variant.entity';

@Entity()
export class AttributeValueVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variant, (variant) => variant.attributeValueVariant)
  variant: Variant;

  @ManyToOne(
    () => AttributeValue,
    (attributeValue) => attributeValue.attributeValueVariant,
  )
  attributeValue: AttributeValue;
}
