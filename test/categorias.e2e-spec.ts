import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './helpers/setup-app';
import { cleanDatabase } from './helpers/db.helper';
import { createUserAndLogin } from './helpers/auth.helper';
import { PrismaService } from '../src/prisma/prisma.service';
import { Categoria } from '../src/categorias/entities/categoria.entity';

describe('CategoriasController (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    ({ app, server, prisma } = await createTestApp());
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
    ({ token } = await createUserAndLogin(server, prisma));
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  describe('GET /categorias', () => {
    it('should return the categories ordered by name', async () => {
      await prisma.categorias.createMany({
        data: [
          { nome: 'Bolos e tortas doces', id: 1 },
          { nome: 'Carnes', id: 2 },
          { nome: 'Aves', id: 3 },
        ],
      });

      const res = await request(server)
        .get('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body = res.body as Categoria[];
      expect(body).toEqual([
        { id: 3, nome: 'Aves' },
        { id: 1, nome: 'Bolos e tortas doces' },
        { id: 2, nome: 'Carnes' },
      ]);
    });

    it('should return 401 without a token', () => {
      return request(server).get('/categorias').expect(401);
    });
  });
});
