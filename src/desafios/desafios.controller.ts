import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { Desafio } from './interface/desafio.interface';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createDesafioDto: CriarDesafioDto) {
    return this.desafiosService.criarDesafio(createDesafioDto);
  }

  @Get('/:_id')
  listarDesafioPorId(@Param('_id') _id: string): Promise<Desafio> {
    return this.desafiosService.consultarDesafioPeloId(_id);
  }

  @Get()
  listarTodosOsDesafios(): Promise<Desafio[]> {
    return this.desafiosService.consultarDesafios();
  }
}
