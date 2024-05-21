import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributesRepository: Repository<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto) {
    try {
      const name = await this.attributesRepository.findOneBy({
        name: createAttributeDto.name,
      });
      console.log(createAttributeDto.name);
      if (name) {
        return {
          status: 401,
          message: 'Attribute already exist',
        };
      }
      await this.attributesRepository.save(
        this.attributesRepository.create(
          createAttributeDto as unknown as Attribute,
        ),
      );
      return {
        status: 201,
        message: 'Register success',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Register failed',
      };
    }
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributesRepository.find({
      relations: { attributeValues: true },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Attribute> {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Attribute not found.');
    }

    return exist;
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Attribute not found.',
      };
    }
    const name = await this.attributesRepository
      .createQueryBuilder('attribute')
      .where('attribute.name = :nameUpdate and attribute.name != :nameExist', {
        nameUpdate: updateAttributeDto.name,
        nameExist: exist.name,
      })
      .getOne();
    if (name) {
      return {
        status: 400,
        message: 'Name already exist',
      };
    }

    return this.attributesRepository
      .update(id, updateAttributeDto)
      .then(() => ({
        status: 200,
        message: 'Update success',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Attribute not found.',
      };
    }
    try {
      return await this.attributesRepository.delete({ id }).then(() => ({
        status: 200,
        message: 'Delete success',
      }));
    } catch (error) {
      return {
        status: 500,
        message: 'Delete failed',
      };
    }
  }
}
