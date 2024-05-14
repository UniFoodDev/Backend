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
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from '../../decorator/role.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllForUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name = '',
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAllForUser(
      {
        page,
        limit,
        route: `${process.env.SERVER}/product`,
      },
      name,
    );
  }

  @Post('cart-items')
  async findAllByIds(@Body() ids: number[]) {
    return this.productService.findByIds(ids);
  }

  @Get('new')
  async findNew(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit = 4,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findNew({
      page,
      limit,
      route: `${process.env.SERVER}/product/new`,
    });
  }

  @Get('popular')
  async findPopular(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit = 4,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findPopular({
      page,
      limit,
      route: `${process.env.SERVER}/product/popular`,
    });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlugForUser(slug);
  }

  // @Get('/category/:slug')
  // findProductByCategory(@Param('slug')) {
  //   return this.productService.findByCategoryForUser();
  // }
}
