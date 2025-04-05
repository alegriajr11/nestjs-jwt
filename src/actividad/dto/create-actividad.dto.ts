import { IsNotEmpty } from "class-validator";

export class CreateActividadDto {

    @IsNotEmpty()
    act_nombre: string;

    @IsNotEmpty()
    act_descripcion: string;

    @IsNotEmpty()
    act_fecha: Date;

    @IsNotEmpty()
    usuarioId: number; // ID del usuario relacionado
}