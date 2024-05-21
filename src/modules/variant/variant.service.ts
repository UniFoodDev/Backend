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

    // Lấy thông tin của các giá trị thuộc tính từ cơ sở dữ liệu
    const attributeValues = await Promise.all(
      attributeValueVariant.map((item) =>
        this.attributeValueRepo.findOne({
          where: { id: item.attributeValue.id },
        }),
      ),
    );

    // Tính tổng giá trị của các thuộc tính
    const totalAttributeValuePrice = attributeValues.reduce(
      (acc, item) => acc + +item.price,
      0,
    );

    // Lấy thông tin của sản phẩm từ cơ sở dữ liệu
    const productInfo = await this.productRepo.findOneBy({
      id: product.id,
    });

    // Tính tổng giá của biến thể sản phẩm bằng cách cộng giá trị của các thuộc tính với giá của sản phẩm
    const price = totalAttributeValuePrice + +productInfo.price;

    // Lưu các biến thể của thuộc tính vào cơ sở dữ liệu
    await this.attributeValueVariantRepo.save(attributeValueVariant);

    // Tạo và lưu biến thể sản phẩm vào cơ sở dữ liệu
    return this.variantRepo.save(
      this.variantRepo.create({
        ...createVariantDto,
        price: price.toString(),
      }),
    );
  }
}
