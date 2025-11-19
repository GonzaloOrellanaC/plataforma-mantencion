import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachinesService {
  constructor(@InjectModel('Machine') private machineModel: Model<any>) {}

  async create(createMachineDto: CreateMachineDto) {
    const created = await this.machineModel.create(createMachineDto);
    return created.toObject();
  }

  async findAll(companyId?: string) {
    const filter = companyId ? { companyId } : {};
    return this.machineModel.find(filter).lean().exec();
  }

  async findOne(id: string, companyId?: string) {
    const filter: any = { _id: id };
    if (companyId) filter.companyId = companyId;
    const found = await this.machineModel.findOne(filter).lean().exec();
    if (!found) throw new NotFoundException('Machine not found');
    return found;
  }

  async update(id: string, updateMachineDto: UpdateMachineDto, companyId?: string) {
    const filter: any = { _id: id };
    if (companyId) filter.companyId = companyId;
    const updated = await this.machineModel
      .findOneAndUpdate(filter, { $set: updateMachineDto }, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Machine not found');
    return updated;
  }

  async remove(id: string, companyId?: string) {
    const filter: any = { _id: id };
    if (companyId) filter.companyId = companyId;
    const res = await this.machineModel.findOneAndDelete(filter).lean().exec();
    if (!res) throw new NotFoundException('Machine not found');
    return res;
  }
}
