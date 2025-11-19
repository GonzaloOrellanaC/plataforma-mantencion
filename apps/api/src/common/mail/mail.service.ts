import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  async sendInvite(to: string, payload: { name?: string; url: string; token: string }) {
    const devMode = !process.env.MAILGUN_API_KEY;
    if (devMode) {
      const outDir = path.resolve(process.cwd(), 'tmp', 'emails');
      fs.mkdirSync(outDir, { recursive: true });
      const filename = path.join(outDir, `${Date.now()}-${to.replace(/[@.]/g, '_')}.json`);
      const content = { to, subject: 'Invitación SGM - Set password', body: `Hola ${payload.name || ''} - set your password: ${payload.url}`, token: payload.token };
      fs.writeFileSync(filename, JSON.stringify(content, null, 2), 'utf8');
      return { ok: true, devFile: filename };
    }

    // Production: use mailgun-js
    try {
      // Lazy require to avoid install in dev
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
      const data = {
        from: process.env.MAILGUN_FROM,
        to,
        subject: 'Invitación SGM - Set password',
        text: `Hola ${payload.name || ''} - set your password: ${payload.url}`,
      };
      await mailgun.messages().send(data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }
}
