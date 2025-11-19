import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AuthModule } from '../auth/auth.module';
import { UploadsModule } from '../uploads/uploads.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from '../common/mail/mail.service';
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');

describe('Invite -> Login -> Uploads e2e (in-memory)', () => {
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
    await app.close();
    if (mongod) await mongod.stop();
  });

  it('register -> set-password -> login -> upload photo', async () => {
    const email = 'e2e+upload@example.com';
    const companyId = 'company-upload-e2e';

    // register
    await request(server)
      .post('/auth/register')
      .send({ email, name: 'E2E', companyId })
      .expect(201)
      .expect((res: any) => expect(res.body).toEqual({ ok: true }));

    expect(lastInvite).toBeTruthy();
    const token = lastInvite.token;

    // set password
    await request(server)
      .post('/auth/set-password')
      .send({ token, password: 'Password123!' })
      .expect(201)
      .expect((res: any) => expect(res.body).toHaveProperty('accessToken'));

    // login
    const login = await request(server).post('/auth/login').send({ email, password: 'Password123!', companyId }).expect(201);
    const accessToken = login.body.accessToken;
    expect(accessToken).toBeTruthy();

    // ensure public/uploads dir exists
    const uploadsDir = require('path').join(process.cwd(), 'public', 'uploads', companyId);
    try {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    } catch (e) {}

    // upload a small buffer as file
    const res = await request(server)
      .post('/uploads/photos')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('companyId', companyId)
      .attach('file', Buffer.from('test image content'), 'test.jpg')
      .expect(201);

    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('url');

    // uploaded file should exist under public/uploads
    const url: string = res.body.url;
    const publicPath = url.replace(/^\/public/, 'public');
    const fullPath = require('path').join(process.cwd(), publicPath);
    const exists = fs.existsSync(fullPath);
    expect(exists).toBe(true);
  }, 20000);
});
