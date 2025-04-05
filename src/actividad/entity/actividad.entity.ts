import { UsuarioEntity } from "src/usuario/entity/usuario.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'actividad'})
export class ActividadEntity {
    @PrimaryGeneratedColumn()
    act_id: number;

    @Column({type: 'varchar', length: 50})
    act_nombre: string;

    @Column({type: 'varchar', length: 255})
    act_descripcion: string;
    
    @Column({type: 'date'})
    act_fecha: Date;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.actividades)
    usuario: UsuarioEntity;
}