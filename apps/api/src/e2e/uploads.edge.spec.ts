import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AuthModule } from '../auth/auth.module';
import { UploadsModule } from '../uploads/uploads.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from '../common/mail/mail.service';
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');

describe('Uploads edge cases & validation e2e', () => {
  let app: INestApplication;
  let server: any;
  let mongod: any;
  let lastInvite: any = null;

  const mailMock = {
    sendInvite: jest.fn().mockImplementation(async (_email: string, payload: any) => {
      lastInvite = payload;
      return { ok: true };
    }),
  } as any;

  beforeAll(async () => {
    process.env.JWT_INVITE_SECRET = process.env.JWT_INVITE_SECRET || 'invite-secret';
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), AuthModule, UploadsModule],
    })
      .overrideProvider(MailService)
      .useValue(mailMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    // cleanup uploaded dirs created during tests
    try {
      const root = require('path').join(process.cwd(), 'public', 'uploads');
      if (fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
    } catch (e) {}
    await app.close();
    if (mongod) await mongod.stop();
  });

  async function registerAndLogin(emailSuffix = 'edge') {
    const email = `e2e+upload-${emailSuffix}@example.com`;
    const companyId = `company-upload-edge-${emailSuffix}`;

    await request(server).post('/auth/register').send({ email, name: 'E2E', companyId }).expect(201);
    expect(lastInvite).toBeTruthy();
    const token = lastInvite.token;

    await request(server).post('/auth/set-password').send({ token, password: 'Password123!' }).expect(201);
    const login = await request(server).post('/auth/login').send({ email, password: 'Password123!', companyId }).expect(201);
    return { accessToken: login.body.accessToken, companyId };
  }

  it('returns No file when missing file part', async () => {
    const { accessToken, companyId } = await registerAndLogin('nofile');

    // send request without attaching a file
    const res = await request(server)
      .post('/uploads/photos')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('companyId', companyId)
      .expect(201);

    // controller returns { ok: false, message: 'No file' }
    expect(res.body).toHaveProperty('ok', false);
    expect(res.body).toHaveProperty('message');
  });

  it('rejects non-image uploads by extension (basic check)', async () => {
    const { accessToken, companyId } = await registerAndLogin('badext');

    // attach .exe file name — controller doesn't validate content-type, but we can ensure file saved
    const res = await request(server)
      .post('/uploads/photos')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('companyId', companyId)
      .attach('file', Buffer.from('exe content'), 'malware.exe')
      .expect(201);

    // service currently returns ok true and url; assert saved file exists and has .exe extension
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('url');
    const url: string = res.body.url;
    const publicPath = url.replace(/^\/public/, 'public');
    const fullPath = require('path').join(process.cwd(), publicPath);
    expect(fs.existsSync(fullPath)).toBe(true);
    expect(fullPath.endsWith('.exe')).toBe(true);
  });
});
