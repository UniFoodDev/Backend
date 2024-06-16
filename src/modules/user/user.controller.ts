import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Req,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  Put,
  Delete,
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
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('user')
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tagService: TagService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
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
  @Roles(Role.Admin, Role.Manager, Role.Employee, Role.User)
  @Put('update-account')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req, updateUserDto);
  }

  @Get('product-tag/:id')
  productTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findAllProductTag(id);
  }

  @Get('product-category/:id')
  productCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findProductByCategory(id);
  }

  @Get('getAll/product')
  product() {
    return this.productService.findAllProduct();
  }

  @Get('get/All/category')
  category() {
    return this.categoryService.findAll();
  }

  @Get('user/get/all/tag')
  tag() {
    return this.tagService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Post('/get/all/employee')
  getAllEmployee(@Req() req) {
    return this.userService.findAllUser(req);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get/user/by/id')
  getUser(@Req() req) {
    return this.userService.getUserByIds(req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create/address')
  createAddress(@Body() createAddressDto: CreateAddressDto, @Req() req) {
    return this.userService.createAdress(createAddressDto, req);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.Admin, Role.Manager, Role.Employee, Role.User)
  @Put('update/address/:id')
  updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.userService.updateAddress(id, updateAddressDto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.Admin, Role.Manager, Role.Employee, Role.User)
  @Post('get/address/user/address')
  getAddress(@Req() req) {
    console.log(req);
    return this.userService.getAddresses(req);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.Admin, Role.Manager, Role.Employee, Role.User)
  @Delete('delete/address/:id')
  deleteAddress(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteAddress(id);
  }
}
