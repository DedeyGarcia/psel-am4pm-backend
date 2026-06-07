import { Controller, Get } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Categoria } from './entities/categoria.entity';

@ApiBearerAuth()
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async findAll(): Promise<Categoria[]> {
    const categories = await this.categoriasService.findAll();
    return categories;
  }
}
