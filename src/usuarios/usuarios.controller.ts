import { Controller, Post, Body, Get, NotFoundException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Public } from '../auth/public.decorator';
import { type AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';

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

  @ApiAuth()
  @Get('me')
  @ApiOkResponse({ type: Usuario })
  async findOne(@CurrentUser() currentUser: AuthUser): Promise<Usuario> {
    const user = await this.usuariosService.findOne(currentUser.userId);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }
}
