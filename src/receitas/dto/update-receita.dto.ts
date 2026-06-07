import { PartialType } from '@nestjs/swagger';
import { CreateReceitaDto } from './create-receita.dto';

export class UpdateReceitaDto extends PartialType(CreateReceitaDto) {}
