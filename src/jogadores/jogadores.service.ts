import { Injectable, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criar-jogador.dto';
import { Jogador } from './interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dto/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador')
    private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} já cadastrado`);
    }

    return this.jogadorModel.create(criarJogadorDto);
  }

  async atualizarJogador(
    _id: string,
    atualizarJogador: AtualizarJogadorDto,
  ): Promise<Jogador> {
    console.log(atualizarJogador);

    return this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogador })
      .exec();
  }

  async consultaTodosJogadores(): Promise<Jogador[]> {
    return this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    await this.jogadorModel.deleteOne({ _id }).exec();
  }
}
