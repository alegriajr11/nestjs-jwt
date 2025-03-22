import { RolEntity } from 'src/rol/entity/rol.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: 'usuario'})
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  usu_id: number;

  @Column({ unique: true })
  usu_nombreUsuario: string;

  @Column()
  usu_email: string;

  @Column()
  usu_password: string;

  @ManyToOne(() => RolEntity, (rol) => rol.usuarios)
  rol: RolEntity;
}
