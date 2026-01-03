import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailMessage, EmailProvider } from './email-message.entity';

@Injectable()
export class EmailMessageService {
  constructor(
    @InjectRepository(EmailMessage)
    private readonly repo: Repository<EmailMessage>,
  ) {}

  async createFromProvider(data: {
    companyId: string;
    provider: EmailProvider;
    from: string;
    to: string;
    subject?: string;
    bodyText: string;
    bodyHtml?: any;
    externalMessageId?: string;
  }): Promise<EmailMessage> {
    const email = this.repo.create({
      ...data,
    });

    return this.repo.save(email);
  }

  async findByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      order: { receivedAt: 'DESC' },
    });
  }
}
