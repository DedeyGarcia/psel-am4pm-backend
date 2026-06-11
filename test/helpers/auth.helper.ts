import request from 'supertest';
import { App } from 'supertest/types';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Login } from '../../src/auth/entities/login.entity';

export interface TestUser {
  id: number;
  login: string;
  senha: string;
  token: string;
}

const DEFAULT_LOGIN = 'teste';
const DEFAULT_PASSWORD = 'senha123';

export async function createUserAndLogin(
  server: App,
  prisma: PrismaService,
  login = DEFAULT_LOGIN,
  senha = DEFAULT_PASSWORD,
): Promise<TestUser> {
  const now = new Date();
  const user = await prisma.usuarios.create({
    data: {
      nome: 'Usuário de Teste',
      login,
      senha: await bcrypt.hash(senha, 10),
      criado_em: now,
      alterado_em: now,
    },
  });

  const res = await request(server)
    .post('/auth/login')
    .send({ login, senha })
    .expect(201);

  const { access_token } = res.body as Login;
  return { id: user.id, login, senha, token: access_token };
}
