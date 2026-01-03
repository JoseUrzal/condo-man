import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './owner.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownerRepository.create(createOwnerDto);
    return this.ownerRepository.save(owner);
  }

  async findAll(): Promise<Owner[]> {
    return this.ownerRepository.find({
      relations: ['units'],
    });
  }

  async findOne(id: string): Promise<Owner> {
    const owner = await this.ownerRepository.findOne({
      where: { id },
      relations: ['units'],
    });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return owner;
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    const owner = await this.findOne(id);
    Object.assign(owner, updateOwnerDto);
    return this.ownerRepository.save(owner);
  }

  async remove(id: string): Promise<void> {
    const owner = await this.findOne(id);
    await this.ownerRepository.remove(owner);
  }
}
