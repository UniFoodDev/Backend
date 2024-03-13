import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AttributeValue } from '../../attribute-value/entities/attribute-value.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ 
    nullable: false,
    default: 0
  })
  price: number;

  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.attribute)
  public attributeValues!: AttributeValue[];
}
