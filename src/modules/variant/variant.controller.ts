import { Body, Controller, Post } from '@nestjs/common';
import { VariantService } from './variant.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateVariantDto } from './dto/create-variant.dto';

@ApiTags('variant')
@Controller('api/variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  async create(@Body() createVariantDto: CreateVariantDto) {
    return await this.variantService.create(createVariantDto);
  }
}
