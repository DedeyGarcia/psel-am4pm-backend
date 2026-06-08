import { ApiProperty } from '@nestjs/swagger';

export class Usuario {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João da Silva', nullable: true })
  nome: string | null;

  @ApiProperty({ example: 'joao' })
  login: string;

  @ApiProperty({ example: '2026-06-07T12:00:00.000Z' })
  criado_em: Date;

  @ApiProperty({ example: '2026-06-07T12:00:00.000Z' })
  alterado_em: Date;
}
