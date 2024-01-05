import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces';
import { JogadoresValidacaoParamsPipe } from './pipes/jogadores-validacao-params.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto): Promise<void> {
    await this.jogadoresService.criarJogador(criarJogadorDto);
  }

  @Put('/:_id')
  async atualizarJogador(
    @Body() criarJogadorDto: CriarJogadorDto,
    @Param('_id') _id: string,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, criarJogadorDto);
  }

  @Get('/:_id')
  async consultarJogadorPeloId(
    @Param('_id', JogadoresValidacaoParamsPipe) _id: string,
  ): Promise<Jogador> {
    return this.jogadoresService.consultarJogadorPeloId(_id);
  }

  @Get()
  async consultarTodosJogadore(): Promise<Jogador[]> {
    return this.jogadoresService.consultaTodosJogadores();
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id') _id: string): Promise<void> {
    await this.jogadoresService.deletarJogador(_id);
  }
}
