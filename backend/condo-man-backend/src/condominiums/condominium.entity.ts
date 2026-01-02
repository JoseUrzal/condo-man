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
import { Company } from '../companies/company.entity';
import { Unit } from '../units/unit.entity';
import { Expense } from '../expenses/expense.entity';
import { Document } from '../documents/document.entity';

@Entity('condominiums')
export class Condominium {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 20, name: 'postal_code' })
  postalCode: string;

  @Column({ type: 'int', name: 'total_units' })
  totalUnits: number;

  @ManyToOne(() => Company, (company) => company.condominiums, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'uuid', name: 'company_id' })
  companyId: string;

  @OneToMany(() => Unit, (unit) => unit.condominium)
  units: Unit[];

  @OneToMany(() => Expense, (expense) => expense.condominium)
  expenses: Expense[];

  @OneToMany(() => Document, (document) => document.condominium)
  documents: Document[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
