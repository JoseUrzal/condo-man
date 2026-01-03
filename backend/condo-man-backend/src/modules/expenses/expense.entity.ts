import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Condominium } from '../condominiums/condominium.entity';
import { Payment } from '../payments/payment.entity';
import { Document } from '../documents/document.entity';
import { ExpenseType } from '../enums';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ExpenseType })
  type: ExpenseType;

  @ManyToOne(() => Condominium, (condominium) => condominium.expenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'condominium_id' })
  condominium: Condominium;

  @Column({ type: 'uuid', name: 'condominium_id' })
  condominiumId: string;

  @OneToMany(() => Payment, (payment) => payment.expense)
  payments: Payment[];

  @OneToMany(() => Document, (document) => document.expense)
  documents: Document[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
