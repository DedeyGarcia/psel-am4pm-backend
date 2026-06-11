import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './helpers/setup-app';
import { cleanDatabase } from './helpers/db.helper';
import { createUserAndLogin, TestUser } from './helpers/auth.helper';
import { PrismaService } from '../src/prisma/prisma.service';
import { Receita } from '../src/receitas/entities/receita.entity';

describe('ReceitasController (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;
  let userA: TestUser;
  let userB: TestUser;
  let categoriaId: number;

  beforeAll(async () => {
    ({ app, server, prisma } = await createTestApp());
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
    userA = await createUserAndLogin(server, prisma, 'usuario_a');
    userB = await createUserAndLogin(server, prisma, 'usuario_b');
    const categoria = await prisma.categorias.create({
      data: { nome: 'Sobremesas' },
    });
    categoriaId = categoria.id;
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  const newRecipe = () => ({
    id_categorias: categoriaId,
    nome: 'Bolo de cenoura',
    modo_preparo: 'Misture e asse por 40 minutos.',
    ingredientes: '2 cenouras, 3 ovos',
  });

  const createRecipe = async (user: TestUser): Promise<Receita> => {
    const res = await request(server)
      .post('/receitas')
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRecipe())
      .expect(201);
    return res.body as Receita;
  };

  describe('POST /receitas', () => {
    it('should create a recipe owned by the authenticated user', async () => {
      const res = await request(server)
        .post('/receitas')
        .set('Authorization', `Bearer ${userA.token}`)
        .send(newRecipe())
        .expect(201);

      const body = res.body as Receita;
      expect(body.id).toEqual(expect.any(Number));
      expect(body.id_usuarios).toBe(userA.id);
      expect(body.nome).toBe('Bolo de cenoura');
    });

    it('should return 400 when modo_preparo is missing', () => {
      return request(server)
        .post('/receitas')
        .set('Authorization', `Bearer ${userA.token}`)
        .send({ nome: 'Sem modo de preparo' })
        .expect(400);
    });

    it('should return 401 without a token', () => {
      return request(server).post('/receitas').send(newRecipe()).expect(401);
    });
  });

  describe('GET /receitas', () => {
    it('should return only the recipes owned by the user', async () => {
      await createRecipe(userA);
      await createRecipe(userB);

      const res = await request(server)
        .get('/receitas')
        .set('Authorization', `Bearer ${userA.token}`)
        .expect(200);

      const body = res.body as Receita[];
      expect(body).toHaveLength(1);
      expect(body[0].id_usuarios).toBe(userA.id);
    });
  });

  describe('GET /receitas/:id', () => {
    it('should return the recipe for its owner', async () => {
      const receita = await createRecipe(userA);

      const res = await request(server)
        .get(`/receitas/${receita.id}`)
        .set('Authorization', `Bearer ${userA.token}`)
        .expect(200);

      expect((res.body as Receita).id).toBe(receita.id);
    });

    it('should return 404 when another user tries to read the recipe', async () => {
      const receita = await createRecipe(userA);

      return request(server)
        .get(`/receitas/${receita.id}`)
        .set('Authorization', `Bearer ${userB.token}`)
        .expect(404);
    });
  });

  describe('PATCH /receitas/:id', () => {
    it('should update the recipe for its owner', async () => {
      const receita = await createRecipe(userA);

      const res = await request(server)
        .patch(`/receitas/${receita.id}`)
        .set('Authorization', `Bearer ${userA.token}`)
        .send({ nome: 'Bolo atualizado' })
        .expect(200);

      expect((res.body as Receita).nome).toBe('Bolo atualizado');
    });

    it('should return 404 when another user tries to update the recipe', async () => {
      const receita = await createRecipe(userA);

      return request(server)
        .patch(`/receitas/${receita.id}`)
        .set('Authorization', `Bearer ${userB.token}`)
        .send({ nome: 'Invasão' })
        .expect(404);
    });
  });

  describe('DELETE /receitas/:id', () => {
    it('should delete the recipe for its owner', async () => {
      const receita = await createRecipe(userA);

      await request(server)
        .delete(`/receitas/${receita.id}`)
        .set('Authorization', `Bearer ${userA.token}`)
        .expect(200);

      await request(server)
        .get(`/receitas/${receita.id}`)
        .set('Authorization', `Bearer ${userA.token}`)
        .expect(404);
    });

    it('should return 404 when another user tries to delete the recipe', async () => {
      const receita = await createRecipe(userA);

      return request(server)
        .delete(`/receitas/${receita.id}`)
        .set('Authorization', `Bearer ${userB.token}`)
        .expect(404);
    });
  });
});
