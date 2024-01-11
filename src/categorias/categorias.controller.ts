import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { Categoria } from './interface/categoria.interface';
import { CriarCategoriaDto } from './interface/criar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return this.categoriasService.consultarTodasCategorias();
  }

  @Get('/:_id')
  async consultarCategoriaPeloId(
    @Param('_id') _id: string,
  ): Promise<Categoria> {
    return this.categoriasService.consultarCategoriaPeloId(_id);
  }
}
