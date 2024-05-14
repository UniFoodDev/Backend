import { Entity, Column, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../database';
import { User } from './user.entity';

@Entity()
export class Address extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  home: string;

  @Column({ nullable: false })
  phone: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
