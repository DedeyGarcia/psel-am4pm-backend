import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';
import type { Express, Request, Response } from 'express';

async function createApp() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const config = new DocumentBuilder()
    .setTitle('Receitas API')
    .setDescription('API de receitas')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api_key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  });

  return app;
}

if (!process.env.VERCEL) {
  void createApp().then((app) => app.listen(process.env.PORT ?? 8000));
}

let serverPromise: Promise<Express> | undefined;

function getServer(): Promise<Express> {
  if (!serverPromise) {
    serverPromise = createApp().then(async (app) => {
      await app.init();
      return app.getHttpAdapter().getInstance() as Express;
    });
  }
  return serverPromise;
}

export default async function handler(req: Request, res: Response) {
  const server = await getServer();
  server(req, res);
}
