import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AuthModule } from '../auth/auth.module';
import { PautasModule } from '../pautas/pautas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from '../common/mail/mail.service';
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Pautas edge cases & validation e2e', () => {
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
      imports: [MongooseModule.forRoot(uri), AuthModule, PautasModule],
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

  async function registerAndLogin(emailSuffix = 'edge') {
    const email = `e2e+pauta-${emailSuffix}@example.com`;
    const companyId = `company-pauta-edge-${emailSuffix}`;

    await request(server).post('/auth/register').send({ email, name: 'E2E', companyId }).expect(201);
    expect(lastInvite).toBeTruthy();
    const token = lastInvite.token;

    await request(server).post('/auth/set-password').send({ token, password: 'Password123!' }).expect(201);
    const login = await request(server).post('/auth/login').send({ email, password: 'Password123!', companyId }).expect(201);
    return { accessToken: login.body.accessToken, companyId };
  }

  it('returns validation failure when creating pauta without required fields (Mongoose or validation layer)', async () => {
    const { accessToken, companyId } = await registerAndLogin('missing-name');
    // With global ValidationPipe, missing required `name` should be rejected with 400
    const res = await request(server)
      .post('/pautas')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ companyId })
      .expect(400);
    expect(res.body).toBeDefined();
  });

  it('rejects update with invalid field types', async () => {
    const { accessToken, companyId } = await registerAndLogin('invalid-update');

    // create valid pauta first
    const createRes = await request(server)
      .post('/pautas')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Edge Pauta', companyId })
      .expect(201);

    const id = createRes.body._id;

    // With ValidationPipe enabled, invalid field types are rejected
    await request(server)
      .put(`/pautas/${id}?companyId=${companyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ fields: 'not-an-array' })
      .expect(400);
  });

  it('enforces company scoping (cannot access other company data)', async () => {
    // user A
    const a = await registerAndLogin('A');
    const b = await registerAndLogin('B');

    // user A creates pauta
    const createRes = await request(server)
      .post('/pautas')
      .set('Authorization', `Bearer ${a.accessToken}`)
      .send({ name: 'A Pauta', companyId: a.companyId })
      .expect(201);

    const id = createRes.body._id;

    // user B attempts to get A's pauta -> should be 404 or 403 (we expect not found)
    await request(server)
      .get(`/pautas/${id}?companyId=${b.companyId}`)
      .set('Authorization', `Bearer ${b.accessToken}`)
      .expect(404);
  });
});
