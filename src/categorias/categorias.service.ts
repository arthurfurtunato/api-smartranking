import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarCategoriaDto } from './interface/criar-categoria.dto';
import { Categoria } from './interface/categoria.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
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
    return this.categoriaModel.find().exec();
  }

  async consultarCategoriaPeloId(_id: string): Promise<Categoria> {
    console.log(_id);

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .exec();

    console.log(categoriaEncontrada);

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria não existe!`);
    }

    return categoriaEncontrada;
  }
}
