// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

const PORT = 3000;

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('Client connected');

  // Spawn FFmpeg process.
  // Adjust the arguments below as needed:
  const ffmpeg = spawn('ffmpeg', [
    '-re',                     // Read input at native frame rate
    '-i', 'input.mp4',         // Input file (replace with your source)
    '-f', 'mpegts',            // Output format: MPEG-TS
    '-codec:v', 'mpeg1video',  // Video codec: MPEG-1
    '-bf', '0',                // No B-frames (reduces latency)
    '-'
  ]);

  // When FFmpeg sends data, emit it to the client.
  ffmpeg.stdout.on('data', (data) => {
    // Note: socket.io can send binary data directly.
    socket.emit('video-data', data);
  });

  // Log FFmpeg errors (optional)
  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg STDERR: ${data}`);
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    ffmpeg.kill();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});