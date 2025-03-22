import { IsString, IsNumber, IsOptional, Length } from 'class-validator';

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  @Length(1, 10)
  pro_nombre?: string;

  @IsNumber()
  @IsOptional()
  pro_precio?: number;
}
