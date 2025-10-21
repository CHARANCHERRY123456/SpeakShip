import http from 'http';
import app from './src/app.js';
import setupSocket from './src/sockets/index.js'; 

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
