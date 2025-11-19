import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from '../common/mail/mail.service';
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Invite -> Login -> Roles e2e (in-memory)', () => {
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
      imports: [MongooseModule.forRoot(uri), AuthModule, RolesModule],
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

  it('register -> set-password -> login -> role CRUD', async () => {
    const email = 'e2e+role@example.com';
    const companyId = 'company-role-e2e';

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

    // create role
    const createRes = await request(server)
      .post('/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'operator', permissions: ['read:machines'], companyId })
      .expect(201);
    expect(createRes.body).toHaveProperty('_id');
    const id = createRes.body._id;

    // list
    const listRes = await request(server).get(`/roles?companyId=${companyId}`).set('Authorization', `Bearer ${accessToken}`).expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    // get one
    await request(server).get(`/roles/${id}`).set('Authorization', `Bearer ${accessToken}`).expect(200);

    // update
    const upd = await request(server)
      .put(`/roles/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'operator-updated' })
      .expect(200);
    expect(upd.body.name).toBe('operator-updated');

    // delete
    await request(server).delete(`/roles/${id}`).set('Authorization', `Bearer ${accessToken}`).expect(200);
  }, 20000);
});
