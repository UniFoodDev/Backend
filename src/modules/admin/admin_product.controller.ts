import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../enums';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from '../product/entities/product.entity';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Product')
@Roles(Role.Admin, Role.Manager, Role.Employee)
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('admin/product')
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Get('top-selling')
  async topSelling() {
    return this.productService.topSelling();
  }

  @Get('total-product')
  async totalProduct() {
    return this.productService.count();
  }

  @Get()
  async findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('name') name = '',
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllForAdmin(
      {
        page,
        limit,
        route: `${process.env.SERVER}/admin/product`,
      },
      name,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
