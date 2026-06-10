import { Controller, Post, Body } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Public } from '../auth/public.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ type: Usuario })
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const user = await this.usuariosService.create(createUsuarioDto);
    return user;
  }
}
