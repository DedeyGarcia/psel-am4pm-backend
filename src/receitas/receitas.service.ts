import { Injectable } from '@nestjs/common';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReceitasService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createReceitaDto: CreateReceitaDto) {
    const now = new Date();
    return this.prisma.receitas.create({
      data: {
        ...createReceitaDto,
        id_usuarios: userId,
        criado_em: now,
        alterado_em: now,
      },
    });
  }

  findAllUserRecipes(userId: number) {
    return this.prisma.receitas.findMany({
      where: { id_usuarios: userId },
    });
  }

  findOneUserRecipe(userId: number, id: number) {
    return this.prisma.receitas.findUnique({
      where: { id, id_usuarios: userId },
    });
  }

  update(userId: number, id: number, updateReceitaDto: UpdateReceitaDto) {
    return this.prisma.receitas.update({
      where: { id, id_usuarios: userId },
      data: { ...updateReceitaDto, alterado_em: new Date() },
    });
  }

  remove(userId: number, id: number) {
    return this.prisma.receitas.delete({
      where: { id, id_usuarios: userId },
    });
  }
}
