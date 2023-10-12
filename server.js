const fs = require('fs');
const WebSocket = require('ws');

const keywords = {
    'cat': ['https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg', 
            'https://images.pexels.com/photos/3643714/pexels-photo-3643714.jpeg', 
            'https://images.pexels.com/photos/1754986/pexels-photo-1754986.jpeg'],
    'dog': ['https://images.pexels.com/photos/3104709/pexels-photo-3104709.jpeg', 
            'https://images.pexels.com/photos/3196887/pexels-photo-3196887.jpeg', 
            'https://images.pexels.com/photos/14666143/pexels-photo-14666143.jpeg'],
    'bird': ['https://images.pexels.com/photos/2662434/pexels-photo-2662434.jpeg', 
            'https://images.pexels.com/photos/2115984/pexels-photo-2115984.jpeg', 
            'https://images.pexels.com/photos/3250454/pexels-photo-3250454.jpeg'],    
  // Другие ключевые слова с соответствующими URL
};

let MAX_CONCURRENT_THREADS = 1; 
fs.readFile('config.txt', 'utf8', function(err, data) {
  if (!err) {
    MAX_CONCURRENT_THREADS = Number(data);
    console.log('MAX_CONCURRENT_THREADS set to', MAX_CONCURRENT_THREADS);
  } else {
    console.error('Failed to read config.txt:', err);
  }
}); 

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connected');
  let threadCount = 0; 

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const urls = keywords[message];
    if (threadCount < MAX_CONCURRENT_THREADS) {
      threadCount++;

      if (urls) {
        socket.send(JSON.stringify(urls));
      } else {
        socket.send(JSON.stringify(new String('empty')));
      }

      console.log('Started stream');
    } else {
      console.log('Maximum concurrent streams reached');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log("Server started on port 8080");