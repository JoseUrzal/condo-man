import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Unit } from './unit.entity';
import { Owner } from '../owners/owner.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const { ownerIds, ...unitData } = createUnitDto;
    const unit = this.unitRepository.create(unitData);

    if (ownerIds && ownerIds.length > 0) {
      const owners = await this.ownerRepository.find({
        where: { id: In(ownerIds) },
      });
      unit.owners = owners;
    }

    return this.unitRepository.save(unit);
  }

  async findAll(): Promise<Unit[]> {
    return this.unitRepository.find({
      relations: ['condominium', 'owners', 'payments'],
    });
  }

  async findOne(id: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({
      where: { id },
      relations: ['condominium', 'owners', 'payments'],
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return unit;
  }

  async findByCondominium(condominiumId: string): Promise<Unit[]> {
    return this.unitRepository.find({
      where: { condominiumId },
      relations: ['owners', 'payments'],
    });
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id);
    const { ownerIds, ...unitData } = updateUnitDto;

    Object.assign(unit, unitData);

    if (ownerIds !== undefined) {
      if (ownerIds.length > 0) {
        const owners = await this.ownerRepository.find({
          where: { id: In(ownerIds) },
        });
        unit.owners = owners;
      } else {
        unit.owners = [];
      }
    }

    return this.unitRepository.save(unit);
  }

  async remove(id: string): Promise<void> {
    const unit = await this.findOne(id);
    await this.unitRepository.remove(unit);
  }

  async addOwner(unitId: string, ownerId: string): Promise<Unit> {
    const unit = await this.findOne(unitId);
    const owner = await this.ownerRepository.findOne({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    }

    if (!unit.owners.find((o) => o.id === ownerId)) {
      unit.owners.push(owner);
      await this.unitRepository.save(unit);
    }

    return unit;
  }

  async removeOwner(unitId: string, ownerId: string): Promise<Unit> {
    const unit = await this.findOne(unitId);
    unit.owners = unit.owners.filter((o) => o.id !== ownerId);
    return this.unitRepository.save(unit);
  }
}
