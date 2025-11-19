import { Schema } from 'mongoose';

export const MachineSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String },
  companyId: { type: String, required: true, index: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: () => new Date() },
});

export interface Machine {
  _id?: string;
  name: string;
  code?: string;
  companyId: string;
  metadata?: any;
  createdAt?: Date;
}
