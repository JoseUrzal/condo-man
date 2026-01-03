import { IsEnum, IsOptional, IsUUID, IsString } from 'class-validator';
import { InboxItemStatus } from '../inbox-item.entity';

export class UpdateInboxItemDto {
  @IsOptional()
  @IsEnum(InboxItemStatus)
  status?: InboxItemStatus;

  @IsOptional()
  @IsString()
  linkedEntityType?: string;

  @IsOptional()
  @IsUUID()
  linkedEntityId?: string;
}
