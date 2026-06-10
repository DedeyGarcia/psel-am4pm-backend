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
      const usuarioCriado = {
        id: 1,
        nome: 'test',
        login: 'test',
        senha: 'hash_fake',
        criado_em: new Date(),
        alterado_em: new Date(),
      };

      bcryptMock.hash.mockResolvedValue('hash_fake' as never);
      prisma.usuarios.create.mockResolvedValue(usuarioCriado);

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

      expect(result).toEqual(usuarioCriado);
    });
  });

  describe('findByLogin', () => {
    it('should find user by login', async () => {
      const usuario = {
        id: 1,
        nome: 'test',
        login: 'test',
        senha: 'hash_fake',
        criado_em: new Date(),
        alterado_em: new Date(),
      };
      prisma.usuarios.findUnique.mockResolvedValue(usuario);

      const result = await service.findByLogin('test');

      expect(prisma.usuarios.findUnique).toHaveBeenCalledWith({
        where: { login: 'test' },
      });
      expect(result).toBe(usuario);
    });

    it('should return null when login does not exist', async () => {
      prisma.usuarios.findUnique.mockResolvedValue(null);

      const result = await service.findByLogin('missing');

      expect(result).toBeNull();
    });
  });
});
