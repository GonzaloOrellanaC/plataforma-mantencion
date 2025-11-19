import { AuthService } from './auth.service';

describe('AuthService (unit)', () => {
  let authService: AuthService;
  let userModelMock: any;
  let mailServiceMock: any;
  let jwtServiceMock: any;

  beforeEach(() => {
    userModelMock = {
      findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
      create: jest.fn(),
      findById: jest.fn().mockReturnValue({ select: jest.fn().mockReturnThis(), lean: jest.fn().mockReturnThis(), exec: jest.fn() }),
    };

    mailServiceMock = {
      sendInvite: jest.fn().mockResolvedValue({ ok: true }),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('signed-invite-token'),
      verify: jest.fn(),
    };

    // Construct service with mocks
    // @ts-ignore - constructing manually for unit test
    authService = new AuthService(userModelMock, mailServiceMock, jwtServiceMock);
  });

  it('register should throw if user exists', async () => {
    userModelMock.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: 'u1' }) });
    await expect(authService.register({ email: 'a@b.com', companyId: 'c1' })).rejects.toThrow();
    expect(userModelMock.findOne).toHaveBeenCalledWith({ email: 'a@b.com', companyId: 'c1' });
  });

  it('register should create user and send invite', async () => {
    userModelMock.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    userModelMock.create.mockResolvedValue({ _id: 'u2' });

    const res = await authService.register({ email: 'x@y.com', name: 'X', companyId: 'c2' });
    expect(userModelMock.create).toHaveBeenCalled();
    expect(jwtServiceMock.sign).toHaveBeenCalled();
    expect(mailServiceMock.sendInvite).toHaveBeenCalledWith('x@y.com', expect.objectContaining({ token: 'signed-invite-token' }));
    expect(res).toEqual({ ok: true });
  });

  it('setPassword should verify token, set password and return access token', async () => {
    const token = 'inv-token';
    const dto = { sub: 'u3', companyId: 'c3', action: 'set-password' };
    jwtServiceMock.verify.mockReturnValue(dto);

    const fakeUser: any = { passwordHash: undefined, save: jest.fn(), _id: 'u3' };
    userModelMock.findById.mockReturnValue({ select: jest.fn().mockReturnThis(), lean: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(fakeUser) });

    jwtServiceMock.sign.mockReturnValue('access-token');

    const result = await authService.setPassword(token, 'newpass');
    expect(jwtServiceMock.verify).toHaveBeenCalledWith(token, expect.any(Object));
    expect(fakeUser.save).toHaveBeenCalled();
    expect(result).toEqual({ accessToken: 'access-token' });
  });

  it('login should return accessToken on success', async () => {
    const email = 'me@x.com';
    const companyId = 'c4';
    const password = 'p';

    const hash = await require('bcryptjs').hash(password, 12);
    const user = { _id: 'u4', passwordHash: hash };
    userModelMock.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
    jwtServiceMock.sign.mockReturnValue('access-login');

    const res = await authService.login(email, password, companyId);
    expect(userModelMock.findOne).toHaveBeenCalledWith({ email, companyId });
    expect(res).toEqual({ accessToken: 'access-login' });
  });
});
