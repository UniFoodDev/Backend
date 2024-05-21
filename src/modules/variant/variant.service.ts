import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { AttributeValueVariant } from '../attribute-value/entities/attribute_value_variant.entity';
import { AttributeValue } from '../attribute-value/entities/attribute-value.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
    @InjectRepository(AttributeValueVariant)
    private attributeValueVariantRepo: Repository<AttributeValueVariant>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    const { attributeValueVariant, product } = createVariantDto;
    const attributeValue = await Promise.all(
      attributeValueVariant.map((item) =>
        this.attributeValueRepo.findOne({
          where: { id: item.attributeValue.id },
        }),
      ),
    );
    const price1 = attributeValue.reduce((acc, item) => acc + +item.price, 0);
    const product1 = await this.productRepo.findOneBy({
      id: product.id,
    });
    const price = price1 + +product1.price;

    await Promise.all([
      this.attributeValueVariantRepo.save(attributeValueVariant),
    ]);
    return this.variantRepo.save(
      this.variantRepo.create({
        ...createVariantDto,
        price: price.toString(),
      }),
    );
  }
}
