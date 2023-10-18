import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as session from 'express-session';
import * as passport from 'passport';

import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:5173'], credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: 'my secret',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60 * 24, // 1 day
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await app.listen(3000);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
