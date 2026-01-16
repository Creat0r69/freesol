const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const data = querystring.parse(body);
      const address = data.address;

      if (address && address.trim() !== '') {
        fs.appendFile(path.join(__dirname, 'addresses.txt'), address + '\n', (err) => {
          if (err) {
            res.writeHead(500);
            res.end('Error saving address');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`<h1>Success! 5 SOL sent to ${address}</h1><a href="/">Back</a>`);
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
});

server.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});