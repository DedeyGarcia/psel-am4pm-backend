import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ReceitasController } from './receitas.controller';
import { ReceitasService } from './receitas.service';
import { AuthUser } from '../auth/current-user.decorator';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';

describe('ReceitasController', () => {
  let controller: ReceitasController;

  const service: DeepMockProxy<ReceitasService> = mockDeep<ReceitasService>();

  const user: AuthUser = { userId: 1, login: 'teste' };
  const recipe = {
    id: 10,
    id_categorias: 1,
    id_usuarios: user.userId,
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
      controllers: [ReceitasController],
      providers: [{ provide: ReceitasService, useValue: service }],
    }).compile();

    controller = module.get<ReceitasController>(ReceitasController);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call the create method of the service and return the created recipe', async () => {
      const dto: CreateReceitaDto = {
        nome: recipe.nome,
        modo_preparo: recipe.modo_preparo,
        ingredientes: recipe.ingredientes,
      };

      service.create.mockResolvedValue(recipe);

      const result = await controller.create(user, dto);

      expect(service.create).toHaveBeenCalledWith(user.userId, dto);
      expect(result).toEqual(recipe);
    });
  });

  describe('findAll', () => {
    it('should call the findAllUserRecipes method of the service and return the recipes', async () => {
      service.findAllUserRecipes.mockResolvedValue([recipe]);

      const result = await controller.findAll(user);

      expect(service.findAllUserRecipes).toHaveBeenCalledWith(user.userId);
      expect(result).toEqual([recipe]);
    });
  });

  describe('findOne', () => {
    it('should call the findOneUserRecipe method of the service and return the requested recipe', async () => {
      service.findOneUserRecipe.mockResolvedValue(recipe);

      const result = await controller.findOne(user, recipe.id);

      expect(service.findOneUserRecipe).toHaveBeenCalledWith(
        user.userId,
        recipe.id,
      );
      expect(result).toEqual(recipe);
    });

    it('should throw NotFoundException when the recipe is not found', async () => {
      service.findOneUserRecipe.mockResolvedValue(null);

      await expect(controller.findOne(user, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should call the update method of the service and return the updated recipe', async () => {
      const dto: UpdateReceitaDto = { nome: 'Bolo atualizado' };

      service.update.mockResolvedValue(recipe);

      const result = await controller.update(user, recipe.id, dto);

      expect(service.update).toHaveBeenCalledWith(user.userId, recipe.id, dto);
      expect(result).toEqual(recipe);
    });
  });

  describe('remove', () => {
    it('should call the remove method of the service and return the deleted recipe', async () => {
      service.remove.mockResolvedValue(recipe);

      const result = await controller.remove(user, recipe.id);

      expect(service.remove).toHaveBeenCalledWith(user.userId, recipe.id);
      expect(result).toEqual(recipe);
    });
  });
});
