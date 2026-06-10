import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CategoriasService } from './categorias.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriasService', () => {
  let service: CategoriasService;

  const prisma: DeepMockProxy<PrismaService> = mockDeep<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all categories ordered by name', async () => {
      const categories = [
        { id: 1, nome: 'Bolos' },
        { id: 2, nome: 'Tortas' },
      ];

      prisma.categorias.findMany.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(prisma.categorias.findMany).toHaveBeenCalledWith({
        orderBy: { nome: 'asc' },
      });
      expect(result).toEqual(categories);
    });
  });
});
