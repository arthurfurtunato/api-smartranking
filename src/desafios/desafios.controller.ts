import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { Desafio } from './interface/desafio.interface';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';
import { DesafioStatusValidacaoPipe } from './pipe/desafio-status-validacao.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createDesafioDto: CriarDesafioDto) {
    return this.desafiosService.criarDesafio(createDesafioDto);
  }

  @Get('/:_id')
  listarDesafioPorId(@Param('_id') _id: string): Promise<Array<Desafio>> {
    return this.desafiosService.consultarDesafioPeloIdJogador(_id);
  }

  @Get()
  listarTodosOsDesafios(): Promise<Desafio[]> {
    return this.desafiosService.consultarDesafios();
  }

  @Put('/:_id')
  async atualizarDesafio(
    @Param('_id') _id: string,
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(_id, atualizarDesafioDto);
  }

  @Delete('/:_id')
  async deletarDesafio(@Param('_id') _id: string): Promise<void> {
    await this.desafiosService.deletarDesafio(_id);
  }
}
