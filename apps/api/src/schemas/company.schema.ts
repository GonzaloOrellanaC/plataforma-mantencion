import { Schema } from 'mongoose';

export const CompanySchema = new Schema({
  name: { type: String, required: true },
  domain: { type: String },
  createdAt: { type: Date, default: () => new Date() },
});

export interface Company {
  _id?: string;
  name: string;
  domain?: string;
  createdAt?: Date;
}
