import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from '../../decorator/role.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Role } from '../../enums';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateEmployeeDto } from './dto/create-employee';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { TagService } from '../tag/tag.service';
import { ProductService } from '../product/product.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('product-tag/:id')
  productTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findAllProductTag(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('product-category/:id')
  productCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findProductByCategory(id);
  }
}
