import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const bcryptMock = jest.mocked(bcrypt);

describe('UsuariosService', () => {
  let service: UsuariosService;

  const prisma: DeepMockProxy<PrismaService> = mockDeep<PrismaService>();

  const createdUser = {
    id: 1,
    nome: 'test',
    login: 'test',
    senha: 'hash_fake',
    criado_em: new Date(),
    alterado_em: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should generate password hash and create user', async () => {
      const dto = { nome: 'test', login: 'test', senha: '123456' };

      bcryptMock.hash.mockResolvedValue('hash_fake' as never);
      prisma.usuarios.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(bcryptMock.hash).toHaveBeenCalledWith('123456', 10);

      expect(prisma.usuarios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            nome: 'test',
            login: 'test',
            senha: 'hash_fake',
          }),
          select: {
            id: true,
            nome: true,
            login: true,
            criado_em: true,
            alterado_em: true,
          },
        }),
      );

      expect(result).toEqual(createdUser);
    });
  });

  describe('findByLogin', () => {
    it('should find user by login', async () => {
      prisma.usuarios.findUnique.mockResolvedValue(createdUser);

      const result = await service.findByLogin('test');

      expect(prisma.usuarios.findUnique).toHaveBeenCalledWith({
        where: { login: 'test' },
      });
      expect(result).toBe(createdUser);
    });

    it('should return null when login does not exist', async () => {
      prisma.usuarios.findUnique.mockResolvedValue(null);

      const result = await service.findByLogin('missing');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return the requested user', async () => {
      prisma.usuarios.findUnique.mockResolvedValue(createdUser);

      const result = await service.findOne(createdUser.id);

      expect(prisma.usuarios.findUnique).toHaveBeenCalledWith({
        where: { id: createdUser.id },
        select: {
          id: true,
          nome: true,
          login: true,
          criado_em: true,
          alterado_em: true,
        },
      });
      expect(result).toEqual(createdUser);
    });
  });
});
