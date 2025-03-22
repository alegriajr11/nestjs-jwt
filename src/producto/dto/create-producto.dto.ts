import { IsString, IsNumber, IsNotEmpty, Length } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  pro_nombre: string;

  @IsNumber()
  @IsNotEmpty()
  pro_precio: number;
}
