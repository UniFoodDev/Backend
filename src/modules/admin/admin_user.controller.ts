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
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../enums';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { UserService } from '../user/user.service';
import { CreateEmployeeDto } from '../user/dto/create-employee';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../user/entities/user.entity';
import { UpdateAccountDto } from '../user/dto/update-account.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin User')
@Controller('api/admin')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin, Role.Manager)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('create-employee')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.userService.createEmployee(createEmployeeDto);
  }

  @Roles(Role.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('create-manager')
  createManager(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.userService.createEmployee(createEmployeeDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('name') name = '',
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAllForAdmin(
      {
        page,
        limit,
        route: `${process.env.SERVER}/admin/user`,
      },
      name,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch('update-account/:id')
  updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.userService.updateAccount(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
