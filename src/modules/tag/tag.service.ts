import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto';
import { UpdateTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const name = await this.tagsRepository.findOneBy({
      name: createTagDto.name,
    });
    if (name) {
      return {
        status: 401,
        message: 'Name already exist',
      };
    }
    return this.tagsRepository.save(createTagDto).then(() => ({
      status: 201,
      message: 'Register success',
    }));
  }
  async update(id: number, updateTagDto: UpdateTagDto) {
    const exist = await this.tagsRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Tag not found.',
      };
    }
    const name = await this.tagsRepository
      .createQueryBuilder('tag')
      .where('tag.name = :nameUpdate and tag.name != :nameExist', {
        nameUpdate: updateTagDto.name,
        nameExist: exist.name,
      })
      .getOne();

    if (name) {
      return {
        status: 400,
        message: 'Name already exist',
      };
    }
    await this.tagsRepository.save({ id, ...updateTagDto });
    return {
      status: 200,
      message: 'Update success',
    };
  }

  async remove(id: number) {
    const exist = await this.tagsRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Tag not found',
      };
    }
    return this.tagsRepository.delete({ id }).then((res) => ({
      status: 200,
      message: 'Delete success',
    }));
  }

  async findAll() {
    const tag = await this.tagsRepository.find();
    const tags = tag.map((item) => {
      const { createdAt, updatedAt, ...rest } = item;
      return rest;
    });
    return {
      status: 200,
      message: 'Get success',
      data: tags,
    };
  }
}