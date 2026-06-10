import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

describe('CategoriasController', () => {
  let controller: CategoriasController;

  const service: DeepMockProxy<CategoriasService> =
    mockDeep<CategoriasService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [{ provide: CategoriasService, useValue: service }],
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call the findAll method of the service and return the categories', async () => {
      const categories = [
        { id: 1, nome: 'Bolos' },
        { id: 2, nome: 'Tortas' },
      ];

      service.findAll.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });
});
