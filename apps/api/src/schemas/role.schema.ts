import { Schema } from 'mongoose';

export const RoleSchema = new Schema({
  name: { type: String, required: true },
  permissions: { type: [String], default: [] },
  companyId: { type: String, index: true },
});

export interface Role {
  _id?: string;
  name: string;
  permissions?: string[];
  companyId?: string;
}
