import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from './entity/actividad.entity';
import { UsuarioEntity } from 'src/usuario/entity/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActividadEntity, UsuarioEntity])],
  providers: [ActividadService],
  controllers: [ActividadController],
  exports: [ActividadService],
})
export class ActividadModule {}
