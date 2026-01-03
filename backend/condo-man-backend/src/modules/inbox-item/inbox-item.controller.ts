import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { InboxItemService } from './inbox-item.service';
import { UpdateInboxItemDto } from './dto/update-inbox-item.dto';

@Controller('inbox')
export class InboxItemController {
  constructor(private readonly service: InboxItemService) {}

  @Get(':companyId')
  findByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompany(companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInboxItemDto) {
    return this.service.update(id, dto);
  }
}
