import express from 'express';
import session from 'express-session';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';
import prisma from './constants/config';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import authRoutes from './routes/authRoutes';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://localhost:8080'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

//SESSIONS
app.use(
  expressSession({
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    // @ts-ignore
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);

const port = Number(process.env.PORT ?? 8080);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started at http://localhost:${port}`);
});
