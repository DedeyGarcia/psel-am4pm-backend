import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwt: JwtService,
  ) {}

  async validateUser(login: string, senha: string) {
    const user = await this.usuariosService.findByLogin(login);
    if (user && (await bcrypt.compare(senha, user.senha))) {
      const { senha: _omit, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: { id: number; login: string }) {
    const payload = { sub: user.id, login: user.login };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token };
  }
}
