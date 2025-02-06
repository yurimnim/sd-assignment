import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.static(path.join(__dirname, '../public')));

// 엔드포인트 추가
app.get('/api/health', (_req: Request, res: Response) => {
    res.send({ status: 'ok' });
  });
  