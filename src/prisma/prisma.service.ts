import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    const adapter = isProduction
      ? PrismaService.createProdAdapter()
      : PrismaService.createDevAdapter();
    super({ adapter });
  }

  private static parseUrl() {
    const url = new URL(process.env.DATABASE_URL!);
    return {
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
    };
  }

  private static createProdAdapter() {
    const ca = process.env.DB_CA_CERT;
    return new PrismaMariaDb({
      ...PrismaService.parseUrl(),
      ssl: ca ? { ca } : true,
    });
  }

  private static createDevAdapter() {
    return new PrismaMariaDb({
      ...PrismaService.parseUrl(),
      allowPublicKeyRetrieval: true,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
