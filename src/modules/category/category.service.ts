import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Image } from '../image/entities/image.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Image)
    private imageRepo: Repository<Image>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const name = await this.categoriesRepository.findOneBy({
      name: createCategoryDto.name,
    });
    if (name) throw new BadRequestException('Name already exist');
    const { images } = createCategoryDto;
    await this.imageRepo.save(images);

    return this.categoriesRepository.save(createCategoryDto).then(() => ({
      status: 201,
      message: 'Register success',
    }));
  }

  async findAll(): Promise<any> {
    const categories = await this.categoriesRepository.find({
      relations: ['images'],
    });
    return {
      status: 200,
      message: 'Get all categories success',
      data: { categories },
    };
  }

  findAllForUser(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: {
        // isActive: true,
      },
    });
  }
  //
  // async findBySlugForUser(slug: string) {
  //   const exist = await this.categoriesRepository.findOne({
  //     where: {
  //       // slug,
  //       // isActive: true,
  //     },
  //   });
  //   if (!exist) {
  //     throw new NotFoundException('Category not found.');
  //   }
  //   return exist;
  // }

  async findOne(id: number): Promise<Category> {
    const exist = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!exist) {
      throw new NotFoundException('Category not found.');
    }

    return exist;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const exist = await this.categoriesRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Category not found.',
      };
    }
    const name = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.name = :nameUpdate and category.name != :nameExist', {
        nameUpdate: updateCategoryDto.name,
        nameExist: exist.name,
      })
      .getOne();

    if (name) {
      return {
        status: 400,
        message: 'Name already exist',
      };
    }
    console.log(updateCategoryDto);
    const { images } = updateCategoryDto;
    await this.imageRepo.save(images);
    await this.categoriesRepository.save({ id, ...updateCategoryDto });
    return {
      status: 200,
      message: 'Update success',
    };
  }

  async remove(id: number) {
    const exist = await this.categoriesRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Category not found.',
      };
    }

    return this.categoriesRepository.delete({ id }).then((res) => ({
      status: 200,
      message: 'Delete success',
    }));
  }
}
