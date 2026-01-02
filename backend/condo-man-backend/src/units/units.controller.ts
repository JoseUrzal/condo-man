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
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Get()
  findAll(@Query('condominiumId') condominiumId?: string) {
    if (condominiumId) {
      return this.unitsService.findByCondominium(condominiumId);
    }
    return this.unitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitsService.remove(id);
  }

  @Post(':id/owners/:ownerId')
  addOwner(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
  ) {
    return this.unitsService.addOwner(id, ownerId);
  }

  @Delete(':id/owners/:ownerId')
  removeOwner(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
  ) {
    return this.unitsService.removeOwner(id, ownerId);
  }
}
