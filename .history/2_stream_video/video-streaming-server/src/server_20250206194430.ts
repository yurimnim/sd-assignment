// src/server.ts
import express, { Request, Response } from 'express';
import http from 'http';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = process.env.PORT || 8000;

// JSON 요청 파싱 미들웨어
app.use(express.json());

// 정적 파일 제공 (예: 클라이언트 HTML, JS 등)
app.use(express.static(path.join(__dirname, '../public')));

// 헬스체크 엔드포인트
app.get('/api/health', (_req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

/**
 * POST /api/stream
 * 클라이언트에서 영상 소스를 받아 스트리밍 URL을 생성하여 응답합니다.
 */
app.post('/api/stream', (req: Request, res: Response) => {
  const { source } = req.body;
  if (!source) {
    res.status(400).send({ error: 'No video source provided.' });
    return;
  }
  // 스트리밍 URL 생성 (예: /stream 엔드포인트에 영상 소스를 query parameter로 전달)
  const streamUrl = `http://localhost:${PORT}/stream?source=${encodeURIComponent(source)}`;
  res.send({ streamUrl });
});

/**
 * GET /stream
 * query parameter로 받은 영상 소스를 FFmpeg에 전달하여 스트리밍 데이터를 생성하고,
 * 해당 데이터를 클라이언트로 전송합니다.
 */
app.get('/stream', (req: Request, res: Response) => {
  const source = req.query.source as string;
  if (!source) {
    res.status(400).send('No video source provided.');
    return;
  }

  // 스트리밍에 적합한 헤더 설정 (MPEG-TS 포맷)
  res.writeHead(200, {
    'Content-Type': 'video/mp2t',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  // FFmpeg 프로세스 실행 (FFmpeg가 설치되어 있어야 함)
  const ffmpeg: ChildProcessWithoutNullStreams = spawn('ffmpeg', [
    '-re',                      // 입력을 원본 속도로 읽음
    '-i', source,               // 입력 파일/URL
    '-f', 'mpegts',             // 출력 포맷: MPEG-TS
    '-codec:v', 'mpeg1video',   // 비디오 코덱: MPEG-1
    '-bf', '0',                 // B-frames 사용 안 함 (지연 최소화)
    '-'                         // stdout으로 출력
  ]);

  // FFmpeg의 stdout 스트림을 클라이언트 응답으로 파이프
  ffmpeg.stdout.pipe(res);

  // FFmpeg stderr 로그 출력 (디버깅용)
  ffmpeg.stderr.on('data', (data: Buffer) => {
    console.error(`FFmpeg STDERR: ${data.toString()}`);
  });

  // 응답 스트림이 종료되면 FFmpeg 프로세스 종료
  res.on('close', () => {
    ffmpeg.kill('SIGINT');
  });
});

// (선택사항) Socket.IO 연결 처리 (추가적인 실시간 통신이 필요한 경우 사용)
io.on('connection', (socket) => {
  console.log('Client connected (Socket.IO)');
  socket.on('disconnect', () => {
    console.log('Client disconnected (Socket.IO)');
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});