import { Controller, Get, Query } from '@nestjs/common';
import { ActividadService } from './actividad.service';

@Controller('actividad')
export class ActividadController {
    constructor(
        private readonly actividadService: ActividadService,
    ) {}

    @Get()
    async obtenerActividades(@Query('order') order: 'ASC' | 'DESC') {
        return await this.actividadService.obtenerActividades(order);
    }

    @Get('usuarioId')
    async obtenerActividadPorUsuario(@Query('usuarioId') usuarioId: number, @Query('order') order: 'ASC' | 'DESC') {
        return await this.actividadService.obtenerActividadPorUsuario(usuarioId, order);
    }


}
