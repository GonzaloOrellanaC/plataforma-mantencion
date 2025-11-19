import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../common/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async register(payload: { email: string; name?: string; companyId: string }) {
    const existing = await this.userModel.findOne({ email: payload.email, companyId: payload.companyId }).exec();
    if (existing) throw new BadRequestException('User already exists');

    const created = await this.userModel.create({ ...payload, active: false });

    // create invite token (use separate invite secret)
    const inviteToken = this.jwtService.sign(
      { sub: created._id.toString(), companyId: payload.companyId, action: 'set-password' },
      { secret: process.env.JWT_INVITE_SECRET || 'invite-secret', expiresIn: '24h' },
    );

    const setPasswordUrl = `${process.env.APP_URL || 'http://localhost:8100'}/set-password?token=${inviteToken}`;

    await this.mailService.sendInvite(payload.email, { name: payload.name, url: setPasswordUrl, token: inviteToken });

    return { ok: true };
  }

  async setPassword(token: string, password: string) {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_INVITE_SECRET || 'invite-secret' }) as any;
      if (!decoded || decoded.action !== 'set-password') throw new BadRequestException('Invalid token');

      const user = await this.userModel.findById(decoded.sub).exec();
      if (!user) throw new BadRequestException('User not found');

      const hash = await bcrypt.hash(password, 12);
      user.passwordHash = hash;
      user.active = true;
      await user.save();

      const access = this.jwtService.sign({ sub: user._id.toString(), companyId: decoded.companyId });

      return { accessToken: access };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async login(email: string, password: string, companyId: string) {
    const user = await this.userModel.findOne({ email, companyId }).exec();
    if (!user || !user.passwordHash) throw new BadRequestException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new BadRequestException('Invalid credentials');

    const access = this.jwtService.sign({ sub: user._id.toString(), companyId });

    return { accessToken: access };
  }
}
