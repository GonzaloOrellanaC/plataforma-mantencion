import { MachinesController } from './machines.controller';

describe('MachinesController (unit)', () => {
  let controller: MachinesController;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    // @ts-ignore
    controller = new MachinesController(serviceMock);
  });

  it('create calls service.create and returns result', async () => {
    const dto = { name: 'M1', companyId: 'c1' };
    serviceMock.create.mockResolvedValue({ _id: 'm1', ...dto });

    await expect(controller.create(dto)).resolves.toEqual({ _id: 'm1', ...dto });
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('findAll calls service.findAll with companyId', async () => {
    serviceMock.findAll.mockResolvedValue([{ _id: 'm1' }]);
    await expect(controller.findAll('c1')).resolves.toEqual([{ _id: 'm1' }]);
    expect(serviceMock.findAll).toHaveBeenCalledWith('c1');
  });

  it('findOne calls service.findOne with id and companyId', async () => {
    serviceMock.findOne.mockResolvedValue({ _id: 'm1' });
    await expect(controller.findOne('m1', 'c1')).resolves.toEqual({ _id: 'm1' });
    expect(serviceMock.findOne).toHaveBeenCalledWith('m1', 'c1');
  });

  it('update calls service.update and returns updated', async () => {
    const dto = { name: 'New' };
    serviceMock.update.mockResolvedValue({ _id: 'm1', ...dto });
    await expect(controller.update('m1', dto, 'c1')).resolves.toEqual({ _id: 'm1', ...dto });
    expect(serviceMock.update).toHaveBeenCalledWith('m1', dto, 'c1');
  });

  it('remove calls service.remove and returns deleted', async () => {
    serviceMock.remove.mockResolvedValue({ _id: 'm1' });
    await expect(controller.remove('m1', 'c1')).resolves.toEqual({ _id: 'm1' });
    expect(serviceMock.remove).toHaveBeenCalledWith('m1', 'c1');
  });

  it('controller propagates service errors (findOne)', async () => {
    serviceMock.findOne.mockRejectedValue(new Error('svc-fail'));
    await expect(controller.findOne('m1', 'c1')).rejects.toThrow('svc-fail');
  });

  it('controller propagates service errors (create)', async () => {
    const dto = { name: 'M1' };
    serviceMock.create.mockRejectedValue(new Error('create-fail'));
    await expect(controller.create(dto)).rejects.toThrow('create-fail');
  });
});
