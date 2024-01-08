import {
  Body,
  Controller,
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
}
