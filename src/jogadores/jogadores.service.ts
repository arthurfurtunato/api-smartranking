import { Injectable } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';

@Injectable()
export class JogadoresService {
  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto) {
    const { email, nome, telefoneCelular } = criarJogadorDto;

    return {
      nome,
      email,
      telefoneCelular,
    };
  }
}
