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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Public()
  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const user = await this.usuariosService.create(createUsuarioDto);
    return user;
  }

  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<Usuario[]> {
    const users = await this.usuariosService.findAll();
    return users;
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    const user = await this.usuariosService.findOne(id);
    return user;
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const user = await this.usuariosService.update(id, updateUsuarioDto);
    return user;
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    const user = await this.usuariosService.remove(id);
    return user;
  }
}
