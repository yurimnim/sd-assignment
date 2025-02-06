// src/server.ts
import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder.
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint for testing
app.get('/api/health', (_req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

// When a client connects via WebSocket
io.on('connection', (socket) => {
  console.log('Client connected');

  // Spawn an FFmpeg process to stream the video.
  // Adjust these arguments to match your video source and desired output.
  const ffmpeg: ChildProcessWithoutNullStreams = spawn('ffmpeg', [
    '-re',                      // Read input at native frame rate
    '-i', 'input.mp4',          // Input file (ensure input.mp4 exists in project root or adjust path)
    '-f', 'mpegts',             // Output format: MPEG-TS
    '-codec:v', 'mpeg1video',   // Video codec: MPEG-1
    '-bf', '0',                 // No B-frames (to reduce latency)
    '-'                         // Output to stdout
  ]);

  // When FFmpeg sends data, forward it to the client.
  ffmpeg.stdout.on('data', (chunk: Buffer) => {
    // Socket.IO can emit binary data.
    socket.emit('video-data', chunk);
  });

  // Log any FFmpeg errors.
  ffmpeg.stderr.on('data', (data: Buffer) => {
    console.error(`FFmpeg STDERR: ${data.toString()}`);
  });

  // Clean up when the client disconnects.
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    ffmpeg.kill('SIGINT');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});