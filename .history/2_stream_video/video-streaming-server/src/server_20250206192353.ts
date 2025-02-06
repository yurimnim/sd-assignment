// src/server.ts
import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = process.env.PORT || 8000;

// 정적 파일 제공 (예: 클라이언트 HTML, JS 등)
app.use(express.static(path.join(__dirname, '../public')));

// 헬스체크 엔드포인트
app.get('/api/health', (_req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // 클라이언트로부터 'start-stream' 이벤트 수신 (비디오 소스 전달)
  socket.on('start-stream', (source: string) => {
    if (!source) {
      socket.emit('error', 'No video source provided.');
      return;
    }
    
    // 입력 받은 소스에 대해 FFmpeg 프로세스 실행
    console.log(`Starting stream with source: ${source}`);

    // FFmpeg 프로세스 생성
    const ffmpeg: ChildProcessWithoutNullStreams = spawn('ffmpeg', [
      '-re',                      // 입력을 원본 속도로 읽음
      '-i', source,               // 입력 파일/URL
      '-f', 'mpegts',             // 출력 포맷: MPEG-TS
      '-codec:v', 'mpeg1video',   // 비디오 코덱: MPEG-1
      '-bf', '0',                 // B-frames 사용하지 않음 (지연 최소화)
      '-'                         // stdout으로 출력
    ]);

    // FFmpeg의 stdout 데이터 수신 시, 타임스탬프와 함께 전송
    ffmpeg.stdout.on('data', (chunk: Buffer) => {
      // 각 chunk 전송 시, 현재 시각(밀리초 단위) 포함
      socket.emit('video-data', {
        timestamp: Date.now(),  // 프레임 데이터 로드 시간
        data: chunk             // 영상 데이터 (Buffer)
      });
    });

    // FFmpeg의 stderr 데이터(로그, 에러 등) 출력
    ffmpeg.stderr.on('data', (data: Buffer) => {
      console.error(`FFmpeg STDERR: ${data.toString()}`);
    });

    // 클라이언트 연결 종료 시 FFmpeg 프로세스 종료
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      ffmpeg.kill('SIGINT');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});