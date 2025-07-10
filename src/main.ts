import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use('/stripe/webhook', express.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
