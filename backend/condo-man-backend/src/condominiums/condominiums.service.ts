import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Condominium } from './condominium.entity';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';

@Injectable()
export class CondominiumsService {
  constructor(
    @InjectRepository(Condominium)
    private readonly condominiumRepository: Repository<Condominium>,
  ) {}

  async create(
    createCondominiumDto: CreateCondominiumDto,
  ): Promise<Condominium> {
    const condominium = this.condominiumRepository.create(createCondominiumDto);
    return this.condominiumRepository.save(condominium);
  }

  async findAll(): Promise<Condominium[]> {
    return this.condominiumRepository.find({
      relations: ['company', 'units', 'expenses', 'documents'],
    });
  }

  async findOne(id: string): Promise<Condominium> {
    const condominium = await this.condominiumRepository.findOne({
      where: { id },
      relations: ['company', 'units', 'expenses', 'documents'],
    });
    if (!condominium) {
      throw new NotFoundException(`Condominium with ID ${id} not found`);
    }
    return condominium;
  }

  async findByCompany(companyId: string): Promise<Condominium[]> {
    return this.condominiumRepository.find({
      where: { companyId },
      relations: ['units', 'expenses', 'documents'],
    });
  }

  async update(
    id: string,
    updateCondominiumDto: UpdateCondominiumDto,
  ): Promise<Condominium> {
    const condominium = await this.findOne(id);
    Object.assign(condominium, updateCondominiumDto);
    return this.condominiumRepository.save(condominium);
  }

  async remove(id: string): Promise<void> {
    const condominium = await this.findOne(id);
    await this.condominiumRepository.remove(condominium);
  }
}
