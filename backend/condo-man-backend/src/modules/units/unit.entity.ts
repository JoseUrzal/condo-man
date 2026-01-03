import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Condominium } from '../condominiums/condominium.entity';
import { Owner } from '../owners/owner.entity';
import { Payment } from '../payments/payment.entity';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, name: 'door_number' })
  doorNumber: string;

  @Column({ type: 'int' })
  floor: number;

  @Column({ type: 'varchar', length: 50 })
  typology: string;

  @Column({ type: 'float' })
  permillage: number;

  @ManyToOne(() => Condominium, (condominium) => condominium.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'condominium_id' })
  condominium: Condominium;

  @Column({ type: 'uuid', name: 'condominium_id' })
  condominiumId: string;

  @ManyToMany(() => Owner, (owner) => owner.units)
  @JoinTable({
    name: 'unit_owners',
    joinColumn: { name: 'unit_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'owner_id', referencedColumnName: 'id' },
  })
  owners: Owner[];

  @OneToMany(() => Payment, (payment) => payment.unit)
  payments: Payment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
