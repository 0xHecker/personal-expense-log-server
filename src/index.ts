import express from 'express';
import cors from 'cors';
import prisma from './constants/config';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRouter';

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
    name: 'cookiee',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // @ts-ignore
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 60 * 24 * 60 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api', userRoutes);
const port = Number(process.env.PORT ?? 8080);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started at http://localhost:${port}`);
});
