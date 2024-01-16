import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarCategoriaDto, AtualizarCategoriaDto } from './dto/';
import { Categoria } from './interface/categoria.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
    }

    return this.categoriaModel.create(criarCategoriaDto);
  }

  async consultarTodasCategorias(): Promise<Categoria[]> {
    return this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(_id: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .populate('jogadores')
      .exec();

    console.log(categoriaEncontrada);

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${_id} não existe!`);
    }

    return categoriaEncontrada;
  }

  async atualizarCategoria(
    _id: string,
    atualizarCategoria: AtualizarCategoriaDto,
  ): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${_id} não existe!`);
    }

    await this.categoriaModel
      .findOneAndUpdate({ _id }, { $set: atualizarCategoria })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    const jogadorEncontrado =
      await this.jogadoresService.consultarJogadorPeloId(idJogador);

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada!`);
    }

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador ${idJogador} não encontrado!`);
    }

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if (jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `Jogador ${idJogador} já cadastrado na categoria ${categoria}!`,
      );
    }

    categoriaEncontrada.jogadores.push(idJogador);

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaEncontrada })
      .exec();
  }

  async consultarCategoriaDoJogador(jogadorId: string): Promise<Categoria> {
    const categoria = await this.categoriaModel
      .findOne()
      .where('jogadores')
      .equals(jogadorId)
      .exec();

    if (!categoria) {
      throw new NotFoundException(
        `Jogador ${jogadorId} não possui categoria cadastrada!`,
      );
    }

    return categoria;
  }
}
