import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReceitasService } from './receitas.service';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { type AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { Receita } from './entities/receita.entity';

@ApiAuth()
@Controller('receitas')
export class ReceitasController {
  constructor(private readonly receitasService: ReceitasService) {}

  @Post()
  @ApiCreatedResponse({ type: Receita })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createReceitaDto: CreateReceitaDto,
  ): Promise<Receita> {
    return this.receitasService.create(user.userId, createReceitaDto);
  }

  @Get()
  @ApiOkResponse({ type: Receita, isArray: true })
  findAll(@CurrentUser() user: AuthUser): Promise<Receita[]> {
    return this.receitasService.findAllUserRecipes(user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: Receita })
  async findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Receita> {
    const recipe = await this.receitasService.findOneUserRecipe(
      user.userId,
      id,
    );

    if (!recipe) throw new NotFoundException('Receita não encontrada');

    return recipe;
  }

  @Patch(':id')
  @ApiOkResponse({ type: Receita })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReceitaDto: UpdateReceitaDto,
  ): Promise<Receita> {
    return this.receitasService.update(user.userId, id, updateReceitaDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Receita })
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Receita> {
    return this.receitasService.remove(user.userId, id);
  }
}
