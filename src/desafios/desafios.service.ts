import { Injectable } from '@nestjs/common';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desafio } from './interface/desafio.interface';
import { CategoriasService } from 'src/categorias/categorias.service';

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

    if (!jogadoresIds.includes(solicitante._id))
      throw new Error(`O solicitante deve ser um dos jogadores da partida!`);

    const solicitanteCategoria =
      await this.categoriaService.consultarCategoriaDoJogador(solicitante._id);

    if (!solicitanteCategoria)
      throw new Error(
        `Jogador soliciante não está cadastrado em nenhuma categoria!`,
      );

    await this.desafioModel.create(criarDesafioDto);
  }
}
