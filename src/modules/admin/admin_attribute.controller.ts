import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../enums';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AttributeService } from '../attribute/attribute.service';
import { CreateAttributeDto } from '../attribute/dto/create-attribute.dto';
import { UpdateAttributeDto } from '../attribute/dto/update-attribute.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Attribute')
@Controller('admin/attribute')
@Roles(Role.Admin, Role.Manager, Role.Employee)
@UseGuards(AccessTokenGuard, RolesGuard)
export class AttributeAdminController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.remove(id);
  }
}
