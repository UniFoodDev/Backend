import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from '../variant/entities/variant.entity';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { AttributeValue } from './entities/attribute-value.entity';

@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValue)
    private attributeValuesRepository: Repository<AttributeValue>,
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async create(createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeValuesRepository
      .save(createAttributeValueDto)
      .then((res) => ({
        status: 201,
        message: 'Register success',
      }));
  }

  async findAll() {
    const attributes = await this.attributeValuesRepository.find();
    return {
      status: 200,
      message: 'Success',
      attributes,
    };
  }

  async findOne(id: number) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Not found.',
      };
    }
    return {
      status: 200,
      message: 'Success',
      exist,
    };
  }

  async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Not found.',
      };
    }
    return this.attributeValuesRepository
      .update(id, updateAttributeValueDto)
      .then((res) => ({
        status: 200,
        message: 'Update success',
      }))
      .catch((err) => ({
        status: 500,
        message: 'Internal server error',
      }));
  }

  async remove(id: number) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Not found.',
      };
    }
    try {
      return await this.attributeValuesRepository
        .delete({ id })
        .then((res) => ({
          status: 200,
          message: 'Delete success',
        }));
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
      };
    }
  }
}
