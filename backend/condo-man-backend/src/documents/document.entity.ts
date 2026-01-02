import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Condominium } from '../condominiums/condominium.entity';
import { Expense } from '../expenses/expense.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500, name: 'file_path' })
  filePath: string;

  @Column({ type: 'varchar', length: 100, name: 'mime_type' })
  mimeType: string;

  @ManyToOne(() => Condominium, (condominium) => condominium.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'condominium_id' })
  condominium: Condominium;

  @Column({ type: 'uuid', name: 'condominium_id' })
  condominiumId: string;

  @ManyToOne(() => Expense, (expense) => expense.documents, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'expense_id' })
  expense: Expense;

  @Column({ type: 'uuid', name: 'expense_id', nullable: true })
  expenseId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
