import { PrismaService } from '../../src/prisma/prisma.service';

export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.receitas.deleteMany();
  await prisma.categorias.deleteMany();
  await prisma.usuarios.deleteMany();
}
