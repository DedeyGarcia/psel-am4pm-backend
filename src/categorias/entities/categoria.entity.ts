import { ApiProperty } from '@nestjs/swagger';

export class Categoria {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sobremesas', nullable: true })
  nome: string | null;
}
