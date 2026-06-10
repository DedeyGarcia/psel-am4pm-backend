import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ReceitasService } from './receitas.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';

describe('ReceitasService', () => {
  let service: ReceitasService;

  const prisma: DeepMockProxy<PrismaService> = mockDeep<PrismaService>();

  const userId = 1;
  const recipe = {
    id: 10,
    id_categorias: 1,
    id_usuarios: userId,
    nome: 'Bolo de cenoura',
    tempo_preparo_minutos: 40,
    porcoes: 8,
    modo_preparo: 'Misture e asse.',
    ingredientes: '2 cenouras, 3 ovos',
    criado_em: new Date(),
    alterado_em: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceitasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ReceitasService>(ReceitasService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a recipe owned by the user', async () => {
      const dto: CreateReceitaDto = {
        nome: recipe.nome,
        modo_preparo: recipe.modo_preparo,
        ingredientes: recipe.ingredientes,
      };

      prisma.receitas.create.mockResolvedValue(recipe);

      const result = await service.create(userId, dto);

      expect(prisma.receitas.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          id_usuarios: userId,
          criado_em: expect.any(Date),
          alterado_em: expect.any(Date),
        },
      });
      expect(result).toEqual(recipe);
    });
  });

  describe('findAllUserRecipes', () => {
    it('should return only recipes that belong to the user', async () => {
      prisma.receitas.findMany.mockResolvedValue([recipe]);

      const result = await service.findAllUserRecipes(userId);

      expect(prisma.receitas.findMany).toHaveBeenCalledWith({
        where: { id_usuarios: userId },
      });
      expect(result).toEqual([recipe]);
    });
  });

  describe('findOneUserRecipe', () => {
    it('should return the requested user recipe', async () => {
      prisma.receitas.findUnique.mockResolvedValue(recipe);

      const result = await service.findOneUserRecipe(userId, recipe.id);

      expect(prisma.receitas.findUnique).toHaveBeenCalledWith({
        where: { id: recipe.id, id_usuarios: userId },
      });
      expect(result).toEqual(recipe);
    });

    it('should return null when the recipe does not match the user', async () => {
      prisma.receitas.findUnique.mockResolvedValue(null);

      const result = await service.findOneUserRecipe(userId, 999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update the requested user recipe', async () => {
      const dto: UpdateReceitaDto = { nome: 'Bolo atualizado' };

      prisma.receitas.update.mockResolvedValue(recipe);

      const result = await service.update(userId, recipe.id, dto);

      expect(prisma.receitas.update).toHaveBeenCalledWith({
        where: { id: recipe.id, id_usuarios: userId },
        data: { ...dto, alterado_em: expect.any(Date) },
      });
      expect(result).toEqual(recipe);
    });
  });

  describe('remove', () => {
    it('should delete the requested user recipe', async () => {
      prisma.receitas.delete.mockResolvedValue(recipe);

      const result = await service.remove(userId, recipe.id);

      expect(prisma.receitas.delete).toHaveBeenCalledWith({
        where: { id: recipe.id, id_usuarios: userId },
      });
      expect(result).toEqual(recipe);
    });
  });
});
