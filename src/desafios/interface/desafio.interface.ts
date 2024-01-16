import { Jogador } from 'src/jogadores/interfaces';

export interface Desafio extends Document {
  dataHoraDesafio: Date;
  status: string;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: string;
  categoria: string;
  jogadores: Array<Jogador>;
  partida: string;
}

export interface Partida extends Document {
  categoria: string;
  jogadores: Array<Jogador>;
  def: string;
  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}
