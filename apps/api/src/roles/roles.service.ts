import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private roleModel: Model<Role>) {}

  async create(dto: any) {
    return this.roleModel.create(dto);
  }

  async findAll(companyId?: string) {
    const q = companyId ? { companyId } : {};
    return this.roleModel.find(q).lean().exec();
  }

  async findOne(id: string) {
    const found = await this.roleModel.findById(id).lean().exec();
    if (!found) throw new NotFoundException('Role not found');
    return found;
  }

  async update(id: string, dto: any) {
    const res = await this.roleModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec();
    if (!res) throw new NotFoundException('Role not found');
    return res;
  }

  async remove(id: string) {
    const res = await this.roleModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Role not found');
    return { ok: true };
  }
}
