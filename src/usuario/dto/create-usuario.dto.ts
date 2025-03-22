import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  usu_nombreUsuario: string;

  @IsEmail()
  usu_email: string;

  @IsNotEmpty()
  @MinLength(6)
  usu_password: string;

  @IsNotEmpty()
  rolId: number;
}
