import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailMessage } from './email-message.entity';
import { EmailMessageService } from './email-message.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailMessage])],
  providers: [EmailMessageService],
  exports: [EmailMessageService],
})
export class EmailMessageModule {}
