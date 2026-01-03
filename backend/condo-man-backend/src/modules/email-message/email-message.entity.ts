import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum EmailProvider {
  GMAIL = 'gmail',
  MAILGUN = 'mailgun',
  OTHER = 'other',
}

@Entity('email_messages')
export class EmailMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'enum', enum: EmailProvider })
  provider: EmailProvider;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'text' })
  bodyText: string;

  @Column({ type: 'jsonb', nullable: true })
  bodyHtml: any;

  @Column({ nullable: true })
  externalMessageId: string;

  @CreateDateColumn()
  receivedAt: Date;
}
