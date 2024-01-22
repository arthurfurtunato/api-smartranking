import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { Categoria } from './interface/categoria.interface';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { Jogador } from 'src/jogadores/interfaces';

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

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ): Promise<void> {
    await this.categoriasService.atualizarCategoria(_id, atualizarCategoriaDto);
  }

  @Post('/:categoria/jogadores/:idJogador')
  @UsePipes(ValidationPipe)
  async atribuirCategoriaJogador(@Param() params: string[]): Promise<void> {
    await this.categoriasService.atribuirCategoriaJogador(params);
  }

  @Get('/jogadores/:jogadorId')
  async consultarCategoriaDoJogador(
    @Param('jogadorId') jogadorId: Jogador,
  ): Promise<Categoria> {
    return this.categoriasService.consultarCategoriaDoJogador(jogadorId);
  }
}
