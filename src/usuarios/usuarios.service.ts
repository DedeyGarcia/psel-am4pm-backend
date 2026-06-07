import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
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

  findAll() {
    return this.prisma.usuarios.findMany({ select: this.publicSelect });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuarios.findUnique({
      where: { id },
      select: this.publicSelect,
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  findByLogin(login: string) {
    return this.prisma.usuarios.findUnique({ where: { login } });
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const data: Record<string, unknown> = { ...dto, alterado_em: new Date() };
    if (dto.senha) data.senha = await bcrypt.hash(dto.senha, 10);
    return this.prisma.usuarios.update({
      where: { id },
      data,
      select: this.publicSelect,
    });
  }

  remove(id: number) {
    return this.prisma.usuarios.delete({
      where: { id },
      select: this.publicSelect,
    });
  }
}
