import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const service: DeepMockProxy<UsuariosService> = mockDeep<UsuariosService>();

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
      const usuarioCriado = {
        id: 1,
        nome: 'test',
        login: 'test',
        criado_em: new Date(),
        alterado_em: new Date(),
      };

      service.create.mockResolvedValue(usuarioCriado);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);

      expect(result).toEqual(usuarioCriado);
    });
  });
});
