import { IsNotEmpty } from 'class-validator';

export class CreateRolDto {
  @IsNotEmpty()
  rol_nombre: string;
}
