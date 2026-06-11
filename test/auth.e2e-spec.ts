import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import * as bcrypt from 'bcrypt';
import { createTestApp } from './helpers/setup-app';
import { cleanDatabase } from './helpers/db.helper';
import { PrismaService } from '../src/prisma/prisma.service';
import { Login } from '../src/auth/entities/login.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, server, prisma } = await createTestApp());
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
    const now = new Date();
    await prisma.usuarios.create({
      data: {
        nome: 'Teste',
        login: 'teste',
        senha: await bcrypt.hash('senha123', 10),
        criado_em: now,
        alterado_em: now,
      },
    });
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return an access token for valid credentials', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({ login: 'teste', senha: 'senha123' })
        .expect(201);

      const body = res.body as Login;
      expect(body.access_token).toEqual(expect.any(String));
    });

    it('should return 401 for a wrong password', () => {
      return request(server)
        .post('/auth/login')
        .send({ login: 'teste', senha: 'errada' })
        .expect(401);
    });

    it('should return 401 for a non-existent user', () => {
      return request(server)
        .post('/auth/login')
        .send({ login: 'fantasma', senha: 'senha123' })
        .expect(401);
    });
  });
});
