import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const service: DeepMockProxy<UsuariosService> = mockDeep<UsuariosService>();

  const createdUser = {
    id: 1,
    nome: 'test',
    login: 'test',
    criado_em: new Date(),
    alterado_em: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: service }],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call the create method of the service and return the created user', async () => {
      const dto: CreateUsuarioDto = {
        nome: 'test',
        login: 'test',
        senha: '123456',
      };

      service.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);

      expect(result).toEqual(createdUser);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service and return the requested user', async () => {
      service.findOne.mockResolvedValue(createdUser);

      const result = await controller.findOne({
        userId: createdUser.id,
        login: createdUser.login,
      });

      expect(service.findOne).toHaveBeenCalledWith(createdUser.id);
      expect(result).toEqual(createdUser);
    });

    it('should throw NotFoundException when the recipe is not found', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(
        controller.findOne({ userId: 999, login: 'notFound' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
