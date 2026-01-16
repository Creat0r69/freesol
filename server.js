const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
  }[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (req.method === 'POST' && (req.url === '/submit' || req.url === '/api/submit')) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          console.log('Body:', body);
          const data = querystring.parse(body);
          console.log('Parsed data:', data);
          const address = data.address;
          if (address && address.trim() !== '') {
            fs.appendFile(path.join(__dirname, 'addresses.txt'), address + '\n', (err) => {
              if (err) {
                res.writeHead(500);
                res.end('Error saving address');
                return;
              }
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(`<h1>Success! 5000 Faucet tokens sent to ${address}</h1><a href="/">Back</a>`);
            });
          } else {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>Please enter a valid address</h1><a href="/">Back</a>');
          }
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});