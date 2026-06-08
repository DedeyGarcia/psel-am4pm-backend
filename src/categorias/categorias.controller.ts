import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';
import { ApiAuth } from '../auth/api-auth.decorator';

@ApiAuth()
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @ApiOkResponse({ type: Categoria, isArray: true })
  async findAll(): Promise<Categoria[]> {
    const categories = await this.categoriasService.findAll();
    return categories;
  }
}
