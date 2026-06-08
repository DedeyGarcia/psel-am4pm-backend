import { ApiProperty } from '@nestjs/swagger';

export class Receita {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1, nullable: true })
  id_categorias: number | null;

  @ApiProperty({ example: 1 })
  id_usuarios: number;

  @ApiProperty({ example: 'Bolo de cenoura', nullable: true })
  nome: string | null;

  @ApiProperty({ example: 40, nullable: true })
  tempo_preparo_minutos: number | null;

  @ApiProperty({ example: 8, nullable: true })
  porcoes: number | null;

  @ApiProperty({ example: 'Misture os ingredientes e asse por 40 minutos.' })
  modo_preparo: string;

  @ApiProperty({
    example: '2 cenouras, 3 ovos, 2 xícaras de açúcar',
    nullable: true,
  })
  ingredientes: string | null;

  @ApiProperty({ example: '2026-06-07T12:00:00.000Z' })
  criado_em: Date;

  @ApiProperty({ example: '2026-06-07T12:00:00.000Z' })
  alterado_em: Date;
}
