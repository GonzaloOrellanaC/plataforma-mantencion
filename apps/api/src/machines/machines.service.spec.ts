import { MachinesService } from './machines.service';
import { NotFoundException } from '@nestjs/common';

describe('MachinesService (unit)', () => {
  let service: MachinesService;
  let machineModelMock: any;

  beforeEach(() => {
    machineModelMock = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
    };

    // @ts-ignore
    service = new MachinesService(machineModelMock);
  });

  it('create should return created object', async () => {
    const dto = { name: 'M1', companyId: 'c1' };
    machineModelMock.create.mockResolvedValue({ toObject: () => ({ _id: 'm1', ...dto }) });

    const res = await service.create(dto as any);
    expect(machineModelMock.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ _id: 'm1', ...dto });
  });

  it('create should throw if model.create rejects', async () => {
    const dto = { name: 'M2' };
    machineModelMock.create.mockRejectedValue(new Error('db error'));
    await expect(service.create(dto as any)).rejects.toThrow('db error');
  });

  it('findAll should return array', async () => {
    const docs = [{ _id: 'm1' }];
    machineModelMock.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(docs) }) });

    const res = await service.findAll('c1');
    expect(machineModelMock.find).toHaveBeenCalledWith({ companyId: 'c1' });
    expect(res).toEqual(docs);
  });

  it('findAll without companyId should query with empty filter', async () => {
    const docs = [{ _id: 'm1' }, { _id: 'm2' }];
    machineModelMock.find.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(docs) }) });

    const res = await service.findAll(undefined);
    expect(machineModelMock.find).toHaveBeenCalledWith({});
    expect(res).toEqual(docs);
  });

  it('findOne should return a machine or throw', async () => {
    const doc = { _id: 'm1' };
    machineModelMock.findOne.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(doc) }) });

    const res = await service.findOne('m1', 'c1');
    expect(machineModelMock.findOne).toHaveBeenCalledWith({ _id: 'm1', companyId: 'c1' });
    expect(res).toEqual(doc);

    machineModelMock.findOne.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });
    await expect(service.findOne('nope', 'c1')).rejects.toThrow(NotFoundException);
  });

  it('findOne should propagate DB errors', async () => {
    machineModelMock.findOne.mockReturnValue({ lean: () => ({ exec: () => Promise.reject(new Error('dbfail')) }) });
    await expect(service.findOne('m1', 'c1')).rejects.toThrow('dbfail');
  });

  it('update should return updated or throw', async () => {
    const updated = { _id: 'm1', name: 'New' };
    machineModelMock.findOneAndUpdate.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(updated) }) });

    const res = await service.update('m1', { name: 'New' } as any, 'c1');
    expect(machineModelMock.findOneAndUpdate).toHaveBeenCalled();
    expect(res).toEqual(updated);

    machineModelMock.findOneAndUpdate.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });
    await expect(service.update('nope', { name: 'x' } as any, 'c1')).rejects.toThrow(NotFoundException);
  });

  it('update should propagate DB errors', async () => {
    machineModelMock.findOneAndUpdate.mockReturnValue({ lean: () => ({ exec: () => Promise.reject(new Error('update-fail')) }) });
    await expect(service.update('m1', { name: 'x' } as any, 'c1')).rejects.toThrow('update-fail');
  });

  it('remove should delete or throw', async () => {
    const deleted = { _id: 'm1' };
    machineModelMock.findOneAndDelete.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(deleted) }) });

    const res = await service.remove('m1', 'c1');
    expect(machineModelMock.findOneAndDelete).toHaveBeenCalled();
    expect(res).toEqual(deleted);

    machineModelMock.findOneAndDelete.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });
    await expect(service.remove('nope', 'c1')).rejects.toThrow(NotFoundException);
  });

  it('remove should propagate DB errors', async () => {
    machineModelMock.findOneAndDelete.mockReturnValue({ lean: () => ({ exec: () => Promise.reject(new Error('del-fail')) }) });
    await expect(service.remove('m1', 'c1')).rejects.toThrow('del-fail');
  });
});
