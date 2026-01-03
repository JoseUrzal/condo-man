import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InboxItem, InboxItemStatus, InboxSource } from './inbox-item.entity';
import { UpdateInboxItemDto } from './dto/update-inbox-item.dto';

@Injectable()
export class InboxItemService {
  constructor(
    @InjectRepository(InboxItem)
    private readonly repo: Repository<InboxItem>,
  ) {}

  async findByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateInboxItemDto) {
    const item = await this.repo.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Inbox item not found');
    }

    Object.assign(item, dto);

    return this.repo.save(item);
  }

  async createFromEmail(params: {
    companyId: string;
    emailMessageId: string;
    suggestedType?: string;
    extractedData?: any;
  }) {
    const item = this.repo.create({
      companyId: params.companyId,
      source: InboxSource.EMAIL,
      emailMessageId: params.emailMessageId,
      suggestedType: params.suggestedType,
      extractedData: params.extractedData,
      status: InboxItemStatus.NEW,
    });

    return this.repo.save(item);
  }
}
