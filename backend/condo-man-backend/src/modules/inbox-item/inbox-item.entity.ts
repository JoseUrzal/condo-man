import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum InboxItemStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  IGNORED = 'ignored',
}

export enum InboxSource {
  EMAIL = 'email',
  MANUAL = 'manual',
}

@Entity('inbox_items')
export class InboxItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'enum', enum: InboxSource })
  source: InboxSource;

  @Column({ type: 'uuid', nullable: true })
  emailMessageId?: string;

  @Column({ type: 'enum', enum: InboxItemStatus, default: InboxItemStatus.NEW })
  status: InboxItemStatus;

  @Column({ nullable: true })
  suggestedType?: string; // expense | todo | note | document

  @Column({ type: 'jsonb', nullable: true })
  extractedData?: any;

  @Column({ nullable: true })
  linkedEntityType?: string;

  @Column({ type: 'uuid', nullable: true })
  linkedEntityId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
