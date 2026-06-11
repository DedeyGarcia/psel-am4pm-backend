import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './helpers/setup-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    ({ app, server } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return the docs hint message', () => {
      return request(server)
        .get('/')
        .expect(200)
        .expect('Acesse /docs para ver a documentação da API.');
    });
  });
});
