import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceitaDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  id_categorias?: number;

  @ApiPropertyOptional({ example: 'Bolo de cenoura' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsNumber()
  tempo_preparo_minutos?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  porcoes?: number;

  @ApiProperty({ example: 'Misture os ingredientes e asse por 40 minutos.' })
  @IsString()
  modo_preparo: string;

  @ApiPropertyOptional({ example: '2 cenouras, 3 ovos, 2 xícaras de açúcar' })
  @IsOptional()
  @IsString()
  ingredientes: string;
}
