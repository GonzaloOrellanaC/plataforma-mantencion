import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../auth/auth.module';
import { MachinesModule } from '../machines/machines.module';
import { getModelToken } from '@nestjs/mongoose';
import { MailService } from '../common/mail/mail.service';

describe('Invite -> Login -> Machines e2e (in-memory mocks)', () => {
  let app: INestApplication;
  let server: any;

  // in-memory stores
  const users: any[] = [];
  const machines: any[] = [];
  let lastInvite: any = null;

  const userModelMock = {
    findOne: (q: any) => ({ exec: async () => users.find(u => u.email === q.email && u.companyId === q.companyId) || null }),
    create: async (data: any) => {
      const _id = (users.length + 1).toString();
      const doc: any = { _id, ...data, save: async function () { const idx = users.findIndex(x => x._id === _id); if (idx >= 0) users[idx] = this; return this; } };
      users.push(doc);
      return doc;
    },
    findById: (id: string) => ({ select: () => ({ lean: () => ({ exec: async () => users.find(u => u._id === id) || null }) }) }),
  } as any;

  const machineModelMock = {
    create: async (data: any) => {
      const _id = (machines.length + 1).toString();
      const doc = { _id, ...data };
      machines.push(doc);
      return { toObject: () => doc };
    },
    find: (q: any) => ({ lean: () => ({ exec: async () => machines.filter(m => (q.companyId ? m.companyId === q.companyId : true)) }) }),
    findOne: (q: any) => ({ lean: () => ({ exec: async () => machines.find(m => m._id === q._id && (!q.companyId || m.companyId === q.companyId)) || null }) }),
    findOneAndUpdate: (q: any, update: any, opts: any) => ({ lean: () => ({ exec: async () => {
      const idx = machines.findIndex(m => m._id === q._id && (!q.companyId || m.companyId === q.companyId));
      if (idx === -1) return null;
      machines[idx] = { ...machines[idx], ...update.$set };
      return machines[idx];
    } }) }),
    findOneAndDelete: (q: any) => ({ lean: () => ({ exec: async () => {
      const idx = machines.findIndex(m => m._id === q._id && (!q.companyId || m.companyId === q.companyId));
      if (idx === -1) return null;
      const [d] = machines.splice(idx, 1);
      return d;
    } }) }),
  } as any;

  const mailMock = {
    sendInvite: jest.fn().mockImplementation(async (_email: string, payload: any) => {
      lastInvite = payload;
      return { ok: true };
    }),
  } as any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, MachinesModule],
    })
      .overrideProvider(getModelToken('User'))
      .useValue(userModelMock)
      .overrideProvider(getModelToken('Machine'))
      .useValue(machineModelMock)
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
  });

  it('register -> set-password -> login -> machine CRUD', async () => {
    const email = 'e2e+user@example.com';
    const companyId = 'company-e2e';

    // register
    await request(server)
      .post('/auth/register')
      .send({ email, name: 'E2E', companyId })
      .expect(201)
      .expect(res => expect(res.body).toEqual({ ok: true }));

    expect(lastInvite).toBeTruthy();
    const token = lastInvite.token;

    // set password
    await request(server)
      .post('/auth/set-password')
      .send({ token, password: 'Password123!' })
      .expect(201)
      .expect(res => expect(res.body).toHaveProperty('accessToken'));

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
