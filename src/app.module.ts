import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectOptions } from 'mongoose';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://admin:${process.env.MONGOOSE_PASSWORD}@cluster-smart-api-ranki.eqkcrm2.mongodb.net/`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      } as ConnectOptions,
    ),
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
