jest.mock('fs', () => {
  const original = jest.requireActual('fs');
  return {
    ...original,
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
  };
});

// Make filename deterministic by mocking uuid and Date.now
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

import * as fs from 'fs';
import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  let service: UploadsService;

  beforeEach(() => {
    service = new UploadsService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('generates a filename with uuid and preserves extension, writes file to disk', () => {
    const writeSpy = (fs.writeFileSync as unknown) as jest.Mock;

    // deterministic timestamp: set system time so service's `new Date()` uses it
    const now = 1700000000000;
    jest.useFakeTimers();
    jest.setSystemTime(new Date(now));

    const file = { originalname: 'photo.png', buffer: Buffer.from('abc') } as any;
    const res = service.saveFile(file, 'company-test');

    // url and path exist
    expect(res).toHaveProperty('url');
    expect(res).toHaveProperty('path');

    // compute expected date folder and filename
    const d = new Date(now);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateSeg = `${y}${m}${day}`;
    const expectedFilename = `${now}-00000000-0000-0000-0000-000000000000.png`;

    // full expected ending path
    const expectedEnding = `/public/uploads/company-test/${dateSeg}/${expectedFilename}`;

    // url or path should contain our expected path segments and filename
    expect(res.url).toEqual(expect.stringContaining(`/public/uploads/company-test/${dateSeg}/`));
    expect(res.url).toEqual(expect.stringContaining(expectedFilename));

    // ensure writeFileSync was called with the buffer and path contains expected segments
    expect(writeSpy).toHaveBeenCalledTimes(1);
    const calledPath = writeSpy.mock.calls[0][0] as string;
    expect(calledPath).toEqual(expect.any(String));
    expect(calledPath).toContain(dateSeg);
    expect(calledPath).toContain(expectedFilename);
    // restore real timers
    jest.useRealTimers();
  });
});
