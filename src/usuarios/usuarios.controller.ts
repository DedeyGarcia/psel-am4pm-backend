import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Public } from '../auth/public.decorator';
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
  @Get()
  @ApiOkResponse({ type: Usuario, isArray: true })
  async findAll(): Promise<Usuario[]> {
    const users = await this.usuariosService.findAll();
    return users;
  }

  @ApiAuth()
  @Get(':id')
  @ApiOkResponse({ type: Usuario })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    const user = await this.usuariosService.findOne(id);
    return user;
  }

  @ApiAuth()
  @Patch(':id')
  @ApiOkResponse({ type: Usuario })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const user = await this.usuariosService.update(id, updateUsuarioDto);
    return user;
  }

  @ApiAuth()
  @Delete(':id')
  @ApiOkResponse({ type: Usuario })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    const user = await this.usuariosService.remove(id);
    return user;
  }
}
