import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const bcryptMock = jest.mocked(bcrypt);

describe('AuthService', () => {
  let service: AuthService;

  const usuariosService: DeepMockProxy<UsuariosService> =
    mockDeep<UsuariosService>();
  const jwt: DeepMockProxy<JwtService> = mockDeep<JwtService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuariosService, useValue: usuariosService },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    const user = {
      id: 1,
      nome: 'test',
      login: 'test',
      senha: 'hash_fake',
      criado_em: new Date(),
      alterado_em: new Date(),
    };

    it('should return the user without password when credentials are valid', async () => {
      usuariosService.findByLogin.mockResolvedValue(user);
      bcryptMock.compare.mockResolvedValue(true as never);

      const result = await service.validateUser('test', '123456');

      expect(usuariosService.findByLogin).toHaveBeenCalledWith('test');
      expect(bcryptMock.compare).toHaveBeenCalledWith('123456', 'hash_fake');
      expect(result).toEqual({
        id: 1,
        nome: 'test',
        login: 'test',
        criado_em: user.criado_em,
        alterado_em: user.alterado_em,
      });
      expect(result).not.toHaveProperty('senha');
    });

    it('should return null when user is not found', async () => {
      usuariosService.findByLogin.mockResolvedValue(null);

      const result = await service.validateUser('test', '123456');

      expect(bcryptMock.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password does not match', async () => {
      usuariosService.findByLogin.mockResolvedValue(user);
      bcryptMock.compare.mockResolvedValue(false as never);

      const result = await service.validateUser('test', 'wrong');

      expect(bcryptMock.compare).toHaveBeenCalledWith('wrong', 'hash_fake');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should sign the payload and return the access token', async () => {
      jwt.signAsync.mockResolvedValue('token_fake');

      const result = await service.login({ id: 1, login: 'test' });

      expect(jwt.signAsync).toHaveBeenCalledWith({ sub: 1, login: 'test' });
      expect(result).toEqual({ access_token: 'token_fake' });
    });
  });
});
