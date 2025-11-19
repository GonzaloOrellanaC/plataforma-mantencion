import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PautasController } from './pautas.controller';
import { PautasService } from './pautas.service';
import { PautaSchema } from './pauta.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Pauta', schema: PautaSchema }])],
  controllers: [PautasController],
  providers: [PautasService],
})
export class PautasModule {}
