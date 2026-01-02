import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CondominiumsService } from './condominiums.service';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';

@Controller('condominiums')
export class CondominiumsController {
  constructor(private readonly condominiumsService: CondominiumsService) {}

  @Post()
  create(@Body() createCondominiumDto: CreateCondominiumDto) {
    return this.condominiumsService.create(createCondominiumDto);
  }

  @Get()
  findAll(@Query('companyId') companyId?: string) {
    if (companyId) {
      return this.condominiumsService.findByCompany(companyId);
    }
    return this.condominiumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.condominiumsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCondominiumDto: UpdateCondominiumDto,
  ) {
    return this.condominiumsService.update(id, updateCondominiumDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.condominiumsService.remove(id);
  }
}
