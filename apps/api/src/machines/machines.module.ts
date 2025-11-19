import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { MachineSchema } from '../schemas/machine.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Machine', schema: MachineSchema }])],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService],
})
export class MachinesModule {}
