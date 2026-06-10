import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const auth: DeepMockProxy<AuthService> = mockDeep<AuthService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call the login method of the service with the authenticated user and return the token', async () => {
      const user = { id: 1, login: '123456' };
      const token = { access_token: 'token_fake' };

      auth.login.mockResolvedValue(token);

      const result = await controller.login({ user });

      expect(auth.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(token);
    });
  });
});
