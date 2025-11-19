import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class UploadsService {
  saveFile(file: any, companyId: string, origin = 'photos') {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dir = path.join(process.cwd(), 'public', 'uploads', companyId, `${yyyy}${mm}${dd}`);
    fs.mkdirSync(dir, { recursive: true });

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${uuidv4()}${ext}`;
    const dest = path.join(dir, filename);
    fs.writeFileSync(dest, file.buffer);

    const publicPath = `/public/uploads/${companyId}/${yyyy}${mm}${dd}/${filename}`;
    return { url: publicPath, path: dest };
  }
}
