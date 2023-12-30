import { Body, Controller, Post } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    const { email, nome, telefoneCelular } = criarJogadorDto;

    return {
      email,
      nome,
      telefoneCelular,
    };
  }
}
