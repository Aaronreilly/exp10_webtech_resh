const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const port = Number(process.env.PORT) || 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error(`Unable to start server on port ${port}: ${error.message}`);
  process.exitCode = 1;
});
