import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desafio, Partida } from './interface/desafio.interface';
import { CategoriasService } from 'src/categorias/categorias.service';
import { DesafioStatus } from './enum/desafio-status.enum';
import { AtribuirPartidaDto } from './dto/atribuir-partida-dto';

@Injectable()
export class DesafiosService {
  constructor(
    private readonly categoriaService: CategoriasService,
    private readonly jogadoresService: JogadoresService,
    @InjectModel('Desafio')
    private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida')
    private readonly partidaModel: Model<Partida>,
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

    if (solicianteIsPlayer.length === 0) {
      throw new NotFoundException(
        `O solicitante deve ser um dos jogadores da partida`,
      );
    }

    const categoriaDoJogador =
      await this.categoriaService.consultarCategoriaDoJogador(solicitante);

    const desafioCriado = new this.desafioModel(criarDesafioDto);

    desafioCriado.categoria = categoriaDoJogador.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();
    desafioCriado.status = DesafioStatus.PENDENTE;

    await desafioCriado.save();
  }

  async consultarDesafioPeloIdJogador(_id: any): Promise<Array<Desafio>> {
    const desafioEncontrado = await this.desafioModel
      .find()
      .where('jogadores')
      .in(_id)
      .populate('jogadores')
      .populate('solicitante')
      .populate('partida')
      .exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não encontrado!`);
    }

    return desafioEncontrado;
  }

  async consultarDesafios(): Promise<Desafio[]> {
    return this.desafioModel
      .find()
      .populate('jogadores')
      .populate('solicitante')
      .populate('partida')
      .exec();
  }

  async atualizarDesafio(_id: string, atualizarDesafioDto: any): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não encontrado!`);
    }

    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }

    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findOne({ _id }).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não encontrado!`);
    }

    desafioEncontrado.status = DesafioStatus.CANCELADO;
    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirPartidaDesafio(
    _id: string,
    atribuirPartidaDto: AtribuirPartidaDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não encontrado!`);
    }

    const jogadorFilter = desafioEncontrado.jogadores.filter((jogador) => {
      return String(jogador._id) === atribuirPartidaDto.def;
    });

    if (jogadorFilter.length === 0) {
      throw new NotFoundException(
        `O jogador vencedor não faz parte do desafio!`,
      );
    }

    const partidaCriada = new this.partidaModel(atribuirPartidaDto);

    partidaCriada.categoria = desafioEncontrado.categoria;
    partidaCriada.jogadores = desafioEncontrado.jogadores;

    const resultado = await partidaCriada.save();

    desafioEncontrado.status = DesafioStatus.REALIZADO;
    desafioEncontrado.partida = resultado;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch {
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }
}
