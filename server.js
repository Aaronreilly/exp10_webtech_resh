// Ex. No. 10 - Developing a Server-Side Application Using Node.js
const http = require('http');

// Escape user-controlled text before placing it in HTML
const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  res.end(`
<!DOCTYPE html>
<html>
<head>
<title>Node.js Server</title>
</head>
<body>
<h1>Welcome to Node.js!</h1>
<p>This is a server-side application.</p>
<p>Request URL: ${escapeHtml(req.url)}</p>
<p>Request Method: ${req.method}</p>
</body>
</html>
`);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
