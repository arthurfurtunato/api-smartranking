import { Injectable, NotFoundException } from '@nestjs/common';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desafio } from './interface/desafio.interface';
import { CategoriasService } from 'src/categorias/categorias.service';
import { DesafioStatus } from './enum/desafio-status.enum';

@Injectable()
export class DesafiosService {
  constructor(
    private readonly categoriaService: CategoriasService,
    private readonly jogadoresService: JogadoresService,
    @InjectModel('Desafio')
    private readonly desafioModel: Model<Desafio>,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<void> {
    const { jogadores, solicitante } = criarDesafioDto;

    const jogadoresIds: Array<string> = [];

    for (const jogador of jogadores) {
      const jogadorConsultado =
        await this.jogadoresService.consultarJogadorPeloId(jogador._id);

      if (!jogadorConsultado)
        throw new Error(`O jogador ${jogador._id} não foi encontrado!`);

      jogadoresIds.push(jogador._id);
    }

    const solicianteIsPlayer = jogadores.filter(
      (jogador) => jogador._id === solicitante,
    );

    console.log(solicianteIsPlayer);

    if (solicianteIsPlayer.length === 0) {
      throw new NotFoundException(
        `O solicitante deve ser um dos jogadores da partida`,
      );
    }

    console.log(solicitante);

    const categoriaDoJogador =
      await this.categoriaService.consultarCategoriaDoJogador(solicitante);

    const desafioCriado = new this.desafioModel(criarDesafioDto);

    desafioCriado.categoria = categoriaDoJogador.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();
    desafioCriado.status = DesafioStatus.PENDENTE;

    await desafioCriado.save();
  }

  async consultarDesafioPeloId(_id: string): Promise<Desafio> {
    const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não encontrado!`);
    }

    return desafioEncontrado;
  }

  async consultarDesafios(): Promise<Desafio[]> {
    return this.desafioModel.find().exec();
  }
}
