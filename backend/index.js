import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import listRouter from './routes/listRouter.js';
dotenv.config();

const app = express()
const port = 3000

connectDB();

const _dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/list', listRouter);

app.use(express.static(path.join(_dirname,'..', '/frontend/dist')));

app.get('*', (_, res) => {
  res.sendFile(path.join(_dirname,'..', 'frontend', 'dist', 'index.html'))
})

app.use((error, req, res, next)=>{
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  })
})

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
})