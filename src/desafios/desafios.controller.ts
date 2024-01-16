import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';

@Controller('desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createDesafioDto: CriarDesafioDto) {
    return this.desafiosService.criarDesafio(createDesafioDto);
  }
}
