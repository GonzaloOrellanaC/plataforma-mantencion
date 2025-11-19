import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pauta } from './pauta.schema';

@Injectable()
export class PautasService {
  constructor(@InjectModel('Pauta') private pautaModel: Model<Pauta>) {}

  async create(dto: any) {
    const created = await this.pautaModel.create(dto);
    return created;
  }

  async findAll(companyId: string) {
    return this.pautaModel.find({ companyId }).lean().exec();
  }

  async findOne(id: string, companyId: string) {
    const found = await this.pautaModel.findOne({ _id: id, companyId }).lean().exec();
    if (!found) throw new NotFoundException('Pauta not found');
    return found;
  }

  async update(id: string, companyId: string, dto: any) {
    const res = await this.pautaModel.findOneAndUpdate({ _id: id, companyId }, { $set: dto }, { new: true }).lean().exec();
    if (!res) throw new NotFoundException('Pauta not found');
    return res;
  }

  async remove(id: string, companyId: string) {
    const res = await this.pautaModel.findOneAndDelete({ _id: id, companyId }).exec();
    if (!res) throw new NotFoundException('Pauta not found');
    return { ok: true };
  }
}
