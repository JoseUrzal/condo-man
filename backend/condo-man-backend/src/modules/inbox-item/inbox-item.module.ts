import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxItem } from './inbox-item.entity';
import { InboxItemService } from './inbox-item.service';
import { InboxItemController } from './inbox-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InboxItem])],
  providers: [InboxItemService],
  controllers: [InboxItemController],
  exports: [InboxItemService],
})
export class InboxItemModule {}
