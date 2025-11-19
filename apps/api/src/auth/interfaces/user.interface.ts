import { Document } from 'mongoose';

export interface User {
  email: string;
  name?: string;
  companyId: string;
  passwordHash?: string;
  roles?: string[];
  active?: boolean;
  createdAt?: Date;
}

export interface UserDocument extends User, Document {}
