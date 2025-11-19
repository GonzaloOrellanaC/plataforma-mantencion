import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel('Company') private companyModel: Model<Company>) {}

  async create(dto: any) {
    return this.companyModel.create(dto);
  }

  async findAll() {
    return this.companyModel.find().lean().exec();
  }

  async findOne(id: string) {
    const found = await this.companyModel.findById(id).lean().exec();
    if (!found) throw new NotFoundException('Company not found');
    return found;
  }

  async update(id: string, dto: any) {
    const res = await this.companyModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec();
    if (!res) throw new NotFoundException('Company not found');
    return res;
  }

  async remove(id: string) {
    const res = await this.companyModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Company not found');
    return { ok: true };
  }
}
