import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActividadEntity } from './entity/actividad.entity';
import { Repository } from 'typeorm';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UsuarioEntity } from 'src/usuario/entity/usuario.entity';

@Injectable()
export class ActividadService {
    constructor(
        @InjectRepository(ActividadEntity)
        private readonly actividadRepository: Repository<ActividadEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

    ) {}


    async registrarActividad(dto: CreateActividadDto){
        const usuario = await this.usuarioRepository.findOne({
            where: {usu_id: dto.usuarioId}
        });

        if(!usuario){
            throw new Error('Usuario no encontrado');
        }

        const actividad = this.actividadRepository.create({
            act_nombre: dto.act_nombre,
            act_descripcion: dto.act_descripcion,
            act_fecha: dto.act_fecha ? new Date() : new Date(),
            usuario
        });

        return await this.actividadRepository.save(actividad);
    }

    //Obtener todas las actividades
    async obtenerActividades(order: 'ASC' | 'DESC'): Promise<ActividadEntity[]> {
        return await this.actividadRepository.createQueryBuilder('actividad')
            .leftJoin('actividad.usuario', 'usuario')
            .addSelect(['usuario.usu_nombreUsuario'])
            .orderBy('actividad.act_fecha', order)
            .getMany();
    }

    //Obtener actividad por usuario
    async obtenerActividadPorUsuario(usuarioId: number, order: 'ASC' | 'DESC'): Promise<ActividadEntity[]> {
        return await this.actividadRepository.createQueryBuilder('actividad')
            .leftJoinAndSelect('actividad.usuario', 'usuario')
            .where('actividad.usuarioId = :usuarioId', { usuarioId })
            .orderBy('actividad.act_fecha', order)
            .getMany();
    }
}
