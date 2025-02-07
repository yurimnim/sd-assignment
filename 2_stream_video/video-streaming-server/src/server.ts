// src/server.ts
import express, { Request, Response } from 'express';
import http from 'http';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 헬스 체크 API
app.get('/api/health', (_req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

/**
 * POST /api/stream
 * 클라이언트에서 영상 소스를 받아 스트리밍 URL을 생성하여 응답
 */
app.post('/api/stream', (req: Request, res: Response) => {
  const { source } = req.body;
  if (!source) {
    res.status(400).send({ error: 'No video source provided.' });
    return;
  }
  const streamUrl = `http://localhost:${PORT}/stream?source=${encodeURIComponent(source)}`;
  res.send({ streamUrl });
});

/**
 * GET /stream
 * FFmpeg을 이용해 실시간 영상 스트리밍 & WebSocket으로 지연 시간 정보 전송
 */
app.get('/stream', (req: Request, res: Response) => {
  let source = req.query.source as string;
  if (!source) {
    res.status(400).send('No video source provided.');
    return;
  }

  if (!source.startsWith('http://') && !source.startsWith('https://')) {
    source = path.resolve(__dirname, '../public', source);
  }
  console.log("source", source);
  console.log('현재 작업 디렉토리:', process.cwd());
  console.log("__dirname", __dirname);

  res.writeHead(200, {
    'Content-Type': 'video/mp2t',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  const ffmpeg: ChildProcessWithoutNullStreams = spawn('ffmpeg', [
    '-re',
    '-i', source,
    '-vf', 'showinfo',
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-bf', '0',
    '-'
  ]);

  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on('data', (data: Buffer) => {
    const log = data.toString();
    const match = log.match(/pts_time:([\d\.]+)/);
    if (match) {
      const ptsTime = parseFloat(match[1]);
      const delay = Date.now() / 1000 - ptsTime;
      io.emit('latency', { ptsTime, delay });
    }
  });

  res.on('close', () => {
    console.log('Stream closed, killing ffmpeg process.');
    ffmpeg.kill('SIGINT');
  });
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 서버 실행
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});