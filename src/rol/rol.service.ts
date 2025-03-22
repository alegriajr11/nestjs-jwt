import { Injectable } from '@nestjs/common';
import { RolEntity } from './entity/rol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { Repository } from 'typeorm';

@Injectable()
export class RolService {

    constructor(
        @InjectRepository(RolEntity)
        private rolRepository: Repository<RolEntity>,
      ) {}
    
      async create(createRolDto: CreateRolDto): Promise<RolEntity> {
        const rol = this.rolRepository.create(createRolDto);
        return this.rolRepository.save(rol);
      }
    
      async findAll(): Promise<RolEntity[]> {
        return this.rolRepository.find();
      }
}
