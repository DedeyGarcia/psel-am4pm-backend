import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './helpers/setup-app';
import { cleanDatabase } from './helpers/db.helper';
import { PrismaService } from '../src/prisma/prisma.service';
import { Usuario } from '../src/usuarios/entities/usuario.entity';
import { createUserAndLogin } from './helpers/auth.helper';

describe('UsuariosController (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, server, prisma } = await createTestApp());
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  describe('POST /usuarios', () => {
    it('should create a user and not return the password', async () => {
      const res = await request(server)
        .post('/usuarios')
        .send({ nome: 'João', login: 'joao', senha: 'senha123' })
        .expect(201);

      const body = res.body as Usuario & { senha?: string };
      expect(body).toMatchObject({ nome: 'João', login: 'joao' });
      expect(body.id).toEqual(expect.any(Number));
      expect(body.senha).toBeUndefined();
    });

    it('should return 400 when login is missing', () => {
      return request(server)
        .post('/usuarios')
        .send({ senha: 'senha123' })
        .expect(400);
    });

    it('should return 400 when the password is too short', () => {
      return request(server)
        .post('/usuarios')
        .send({ login: 'joao', senha: '123' })
        .expect(400);
    });

    it('should return 400 when an unknown field is sent', () => {
      return request(server)
        .post('/usuarios')
        .send({ login: 'joao', senha: 'senha123', admin: true })
        .expect(400);
    });

    it('should return 409 when the login is already taken', async () => {
      await request(server)
        .post('/usuarios')
        .send({ login: 'joao', senha: 'senha123' })
        .expect(201);

      return request(server)
        .post('/usuarios')
        .send({ login: 'joao', senha: 'senha123' })
        .expect(409);
    });
  });

  describe('GET /usuarios/me', () => {
    it('should return the logged in user and not return the password', async () => {
      const user = await createUserAndLogin(server, prisma);

      const res = await request(server)
        .get('/usuarios/me')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(res.body).toMatchObject({
        nome: 'Usuário de Teste',
        login: 'teste',
      });

      const body = res.body as Usuario & { senha?: string };
      expect(body.id).toEqual(user.id);
      expect(body.login).toEqual(user.login);
      expect(body.senha).toBeUndefined();
    });

    it('should return 401 without a token', () => {
      return request(server).get('/usuarios/me').expect(401);
    });
  });
});
