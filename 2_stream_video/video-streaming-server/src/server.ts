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
 * hh:mm:ss.xxx 형식의 문자열을 초 단위 숫자로 변환하는 함수
 */
const timeStringToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }
  return parseFloat(timeStr);
};

/**
 * socket.io 연결 처리
 */
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  let ffmpeg: ChildProcessWithoutNullStreams | null = null;

  // 클라이언트에서 "start-stream" 이벤트를 받으면 스트리밍을 시작
  socket.on('start-stream', (source: string) => {
    if (!source) {
      socket.emit('error', { message: 'No video source provided.' });
      return;
    }
    
    // source가 URL이 아니면 서버의 public 폴더에서 파일 경로로 해석
    if (!source.startsWith('http://') && !source.startsWith('https://')) {
      source = path.resolve(__dirname, '../public', source);
    }
    //console.log('Starting stream for source:', source);

    // 스트림 시작 시각 (초 단위, ffmpeg의 pts_time은 입력 시작 시점부터의 상대값임)
    const streamStart = Date.now() / 1000;

    // ffmpeg를 Fragmented MP4(fMP4) 출력 형식으로 실행 (MSE에서 재생가능)
    ffmpeg = spawn('ffmpeg', [
      '-loglevel', 'verbose', // 또는 'debug'로 설정해 자세한 로그 출력
      '-re',
      '-i', source,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-g', '30',
      '-c:a', 'aac',
      '-ar', '44100',
      '-b:a', '128k',
      '-f', 'mp4',
      '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
      'pipe:1'
    ]);
    
    // ffmpeg 로그에서 시간 정보를 파싱하는 함수 (streamStart를 활용)
    const handleFfmpegData = (data: Buffer) => {
      const dataString = data.toString();
      //console.log('ffmpeg output:', dataString);

      // "pts_time:" 또는 "time=" 뒤의 값을 추출 (예: "pts_time:1.234" 또는 "time=00:00:01.234")
      const match = dataString.match(/(?:pts_time:|time=)([\d:.]+)/);
      if (match) {
        let ptsTime: number;
        if (match[1].includes(':')) {
          // hh:mm:ss.xxx 형식이면 초 단위로 변환
          ptsTime = timeStringToSeconds(match[1]);
        } else {
          ptsTime = parseFloat(match[1]);
        }
        // 현재 시간(스트림 시작 후 경과 시간)에서 ffmpeg가 전달한 상대 시간(ptsTime)을 빼서 지연시간 계산
        const delay = (Date.now() / 1000 - streamStart) - ptsTime;
        //console.log('Computed delay:', delay);
        socket.emit('latency', { ptsTime, delay });
      } else {
        //console.log('No valid time info found in data');
      }
    };

    // stdout과 stderr 모두에서 데이터 파싱
    ffmpeg.stdout.on('data', (data: Buffer) => {
      handleFfmpegData(data);
    });

    ffmpeg.stderr.on('data', (data: Buffer) => {
      handleFfmpegData(data);
    });

    ffmpeg.on('exit', (code, signal) => {
      console.log(`ffmpeg process exited with code: ${code}, signal: ${signal}`);
    });
  });

  // 클라이언트에서 "stop-stream" 이벤트가 오면 ffmpeg 프로세스 종료
  socket.on('stop-stream', () => {
    if (ffmpeg) {
      console.log('Stop-stream received. Killing ffmpeg process.');
      ffmpeg.kill('SIGINT');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (ffmpeg) {
      ffmpeg.kill('SIGINT');
    }
  });
});

// 서버 실행
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});