import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/orderItem.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { In, Like, Repository } from 'typeorm';
import { Image } from '../image/entities/image.entity';
import { AttributeProduct } from '../attribute/entities/attribute_product.entity';
import { TagProduct } from '../tag/entities/tag_product.entity';
import { Variant } from '../variant/entities/variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Image)
    private imageRepo: Repository<Image>,
    @InjectRepository(TagProduct)
    private tagProductRepo: Repository<TagProduct>,
    @InjectRepository(AttributeProduct)
    private attributeProductRepo: Repository<AttributeProduct>,
  ) {}

  async topSelling() {
    // Select Product.name, SUM(OderItem.orderedQuantity) as sold
    // from Product, Variant, OrderItem, Order
    // where Product.id = Variant.productId
    //    and Variant.id = OderItem.VariantId
    //    and OderItem.OrderId = Order.id
    // having sold > 0
    // limit 6
    // group by Product.name

    return this.productRepo
      .createQueryBuilder('product')
      .select('product.name', 'name')
      .addSelect('SUM(oi.orderedQuantity)', 'sold')
      .leftJoin(Variant, 'v', 'product.id = v.productId')
      .leftJoin(OrderItem, 'oi', 'v.id = oi.variantId')
      .leftJoin(Order, 'o', 'o.id = oi.orderId')
      .groupBy('product.name')
      .having('sold > 0')
      .orderBy('sold', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async findAllForAdmin(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {
        name: Like(`%${name}%`),
      },
      relations: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async findAllForUser(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {
        name: Like(`%${name}%`),
      },
      order: {},
      relations: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async findNew(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {},
      order: {},
      relations: {
        images: true,
        variants: true,
      },
    });
  }

  async findPopular(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepo, options, {
      where: {},
      order: {},
      relations: {
        images: true,
        variants: true,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.tag_product', 'tag_product')
      .leftJoinAndSelect('tag_product.tag', 'tag')
      .leftJoinAndSelect('product.attributeProducts', 'attributeProducts')
      .leftJoinAndSelect('attributeProducts.attribute', 'attribute')
      .getMany();
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    const exist = await this.productRepo.find({
      where: { id: In(ids) },
      relations: {
        category: true,
        images: true,
        variants: true,
      },
    });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return exist;
  }

  async findById(id: number): Promise<Product> {
    const exist = await this.productRepo.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        variants: {},
      },
    });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return exist;
  }

  async findBySlugForUser(plug: string): Promise<Product> {
    const exist = await this.productRepo.findOne({
      where: {},
      relations: {
        category: true,
        images: true,
        variants: {},
      },
    });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }

    return exist;
  }

  async findByCategoryForUser(): Promise<Product[]> {
    return await this.productRepo.find({
      where: {
        category: {},
      },
      relations: {
        images: true,
        variants: {},
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const name = await this.productRepo.findOneBy({
      name: createProductDto.name,
    });
    if (name) {
      return {
        status: 401,
        message: 'Name already exist',
      };
    }
    const { images, tag_product, attributeProducts } = createProductDto;
    await Promise.all([
      this.imageRepo.save(images),
      this.tagProductRepo.save(tag_product),
      this.attributeProductRepo.save(attributeProducts),
    ]);
    const product = await this.productRepo.save(createProductDto);
    return {
      status: 201,
      message: 'Register success',
      data: { product },
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const exist = await this.productRepo.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Product not found.',
      };
    }
    const name = await this.productRepo
      .createQueryBuilder('product')
      .where('product.name = :nameUpdate and product.name != :nameExist', {
        nameUpdate: updateProductDto.name,
        nameExist: exist.name,
      })
      .getOne();
    if (name) {
      return {
        status: 400,
        message: 'Name already exist',
      };
    }

    const { images, tag_product, attributeProducts } = updateProductDto;
    await Promise.all([
      this.imageRepo.save(images),
      this.tagProductRepo.save(tag_product),
      this.attributeProductRepo.save(attributeProducts),
    ]);
    await this.productRepo.save({ id, ...updateProductDto });
    return {
      status: 200,
      message: 'Update success',
    };
  }

  async remove(id: number) {
    const exist = await this.productRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Product not found.');
    }
    return this.productRepo.delete({ id }).then(() => ({
      status: 200,
      message: 'Delete success',
    }));
  }

  async count() {
    return await this.productRepo.count();
  }

  async findProductByCategory(categoryId: number) {
    return await this.productRepo.find({
      where: {
        category: { id: categoryId },
      },
      relations: [
        'images',
        'attributeProducts.attribute',
        'attributeProducts.attribute.attributeValues',
      ],
    });
  }

  async findAllProduct() {
    const products = await this.productRepo.find({
      take: 100,
      relations: [
        'images',
        'attributeProducts.attribute',
        'attributeProducts.attribute.attributeValues',
      ],
    });
    return {
      status: 200,
      message: 'Get success',
      data: products,
    };
  }
}
