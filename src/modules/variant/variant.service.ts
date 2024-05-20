import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}
}
