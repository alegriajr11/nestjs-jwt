import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'producto'})
export class ProductoEntity {

    @PrimaryGeneratedColumn()
    pro_id: number;

    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
    pro_nombre: string;

    @Column({type: 'float', nullable: false})
    pro_precio: number;
}