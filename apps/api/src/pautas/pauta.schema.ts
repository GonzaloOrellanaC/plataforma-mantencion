import { Schema } from 'mongoose';

export const PautaSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    schemaVersion: { type: String, default: '1.0' },
    version: { type: Number, default: 1 },
    fields: { type: Schema.Types.Mixed, default: [] },
    companyId: { type: String, required: true, index: true },
    createdBy: { type: String },
    externalId: { type: String },
  },
  { timestamps: true },
);

export interface Pauta {
  _id?: string;
  name: string;
  description?: string;
  schemaVersion?: string;
  version?: number;
  fields: any;
  companyId: string;
  createdBy?: string;
  externalId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
