import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../enums';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TagService } from '../tag/tag.service';
import { CreateTagDto } from '../tag/dto';
import { UpdateTagDto } from '../tag/dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';

@ApiTags('Admin Tag')
@Roles(Role.Admin, Role.Manager, Role.Employee)
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('admin/tag')
export class TagAdminController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} tag`;
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
