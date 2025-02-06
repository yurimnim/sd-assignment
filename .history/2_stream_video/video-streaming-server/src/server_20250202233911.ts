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


io.on('connection', (socket) => {
  console.log('Client connected');

  const ffmpeg: ChildProcessWithoutNullStreams = spawn('ffmpeg', [
    '-re',                      
    '-i', 'input.mp4',          
    '-f', 'mpegts',             
    '-codec:v', 'mpeg1video',   
    '-bf', '0',                 
    '-'                         
  ]);


  ffmpeg.stdout.on('data', (chunk: Buffer) => {
    socket.emit('video-data', chunk);
  });

  ffmpeg.stderr.on('data', (data: Buffer) => {
    console.error(`FFmpeg STDERR: ${data.toString()}`);
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected');
    ffmpeg.kill('SIGINT');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});