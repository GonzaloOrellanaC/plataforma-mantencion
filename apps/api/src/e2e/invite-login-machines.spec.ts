import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AuthModule } from '../auth/auth.module';
import { MachinesModule } from '../machines/machines.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from '../common/mail/mail.service';
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Invite -> Login -> Machines e2e (in-memory mocks)', () => {
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
    // ensure secrets expected by JwtModule/JwtStrategy
    process.env.JWT_INVITE_SECRET = process.env.JWT_INVITE_SECRET || 'invite-secret';
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), AuthModule, MachinesModule],
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

  it('register -> set-password -> login -> machine CRUD', async () => {
    const email = 'e2e+user@example.com';
    const companyId = 'company-e2e';

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

    // create machine
    const createRes = await request(server)
      .post('/machines')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Lathe', companyId })
      .expect(201);
    expect(createRes.body).toHaveProperty('_id');
    const id = createRes.body._id;

    // get list
    const listRes = await request(server).get(`/machines?companyId=${companyId}`).set('Authorization', `Bearer ${accessToken}`).expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    // get one
    await request(server).get(`/machines/${id}?companyId=${companyId}`).set('Authorization', `Bearer ${accessToken}`).expect(200);

    // update
    const upd = await request(server)
      .put(`/machines/${id}?companyId=${companyId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Updated' })
      .expect(200);
    expect(upd.body.name).toBe('Updated');

    // delete
    await request(server).delete(`/machines/${id}?companyId=${companyId}`).set('Authorization', `Bearer ${accessToken}`).expect(200);
  }, 20000);
});
