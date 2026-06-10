import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  private readonly publicSelect = {
    id: true,
    nome: true,
    login: true,
    criado_em: true,
    alterado_em: true,
  };

  async create(createUsuarioDto: CreateUsuarioDto) {
    const passwordHash = await bcrypt.hash(createUsuarioDto.senha, 10);
    const now = new Date();
    return this.prisma.usuarios.create({
      data: {
        nome: createUsuarioDto.nome,
        login: createUsuarioDto.login,
        senha: passwordHash,
        criado_em: now,
        alterado_em: now,
      },
      select: this.publicSelect,
    });
  }

  findByLogin(login: string) {
    return this.prisma.usuarios.findUnique({ where: { login } });
  }
}
