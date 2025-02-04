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

// Serve static files from the "public" folder.
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.send({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for the "start-stream" event from the client with the video source
  socket.on('start-stream', (source: string) => {
    if (!source) {
      socket.emit('error', 'No video source provided.');
      return;
    }
    
    // Optional: Validate or sanitize the source string here!
    console.log(`Starting stream with source: ${source}`);

    // Spawn an FFmpeg process using the provided source.
    // Adjust the FFmpeg arguments as needed for your use case.
    const ffmpeg: ChildProcessWithoutNullStreams = spawn('ffmpeg', [
      '-re',                      // Read input at native frame rate
      '-i', source,               // Input file/URL (e.g., a relative path, absolute path, or S3 public URL)
      '-f', 'mpegts',             // Output format: MPEG-TS
      '-codec:v', 'mpeg1video',   // Video codec: MPEG-1
      '-bf', '0',                 // No B-frames for reduced latency
      '-'                         // Output to stdout
    ]);

    // Pipe FFmpeg's stdout data to the client via Socket.IO
    ffmpeg.stdout.on('data', (chunk: Buffer) => {
      socket.emit('video-data', chunk);
    });

    // Log FFmpeg errors for debugging
    ffmpeg.stderr.on('data', (data: Buffer) => {
      console.error(`FFmpeg STDERR: ${data.toString()}`);
    });

    // When the client disconnects, kill the FFmpeg process
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      ffmpeg.kill('SIGINT');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});