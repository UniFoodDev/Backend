import { Body, Controller, Post } from '@nestjs/common';
import { VariantService } from './variant.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('variant')
@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}
}
