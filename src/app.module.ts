import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://admin:${process.env.MONGOOSE_PASSWORD}@cluster-smart-api-ranki.eqkcrm2.mongodb.net/`,
    ),
    JogadoresModule,
    CategoriasModule,
    DesafiosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
