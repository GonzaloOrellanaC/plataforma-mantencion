import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  companyId: { type: String, required: true },
  passwordHash: { type: String },
  roles: [{ type: String }],
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});
