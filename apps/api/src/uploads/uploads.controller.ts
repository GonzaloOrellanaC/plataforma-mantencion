import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('photos')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@UploadedFile() file: any, @Body('companyId') companyId: string) {
    if (!file) return { ok: false, message: 'No file' };
    const res = this.uploadsService.saveFile(file, companyId || 'unknown');
    return { ok: true, url: res.url };
  }
}
