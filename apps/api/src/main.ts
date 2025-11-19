import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule as any);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }));

  // Serve static files from ./public at /public
  const publicPath = join(process.cwd(), 'public');
  app.useStaticAssets(publicPath, { prefix: '/public/' });

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3333);
  console.log('API listening on port', process.env.PORT || 3333);
}

bootstrap();
