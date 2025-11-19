import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './interfaces/user.interface';

export interface AuthUser {
  id: string;
  email: string;
  companyId: string;
  roles?: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'access-secret',
    });
  }

  async validate(payload: any): Promise<AuthUser> {
    const user = (await this.userModel.findById(payload.sub).select('-passwordHash').lean().exec()) as User | null;
    if (!user) throw new UnauthorizedException();
    return { id: (user as any)._id.toString(), email: user.email, companyId: user.companyId, roles: user.roles };
  }
}
