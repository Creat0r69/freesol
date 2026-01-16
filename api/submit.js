const querystring = require('querystring');

export default function handler(req, res) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = querystring.parse(body);
      const address = data.address;
      if (address && address.trim() !== '') {
        console.log('New address submitted:', address);
        res.status(200).send(`<h1>Success! 5000 Faucet tokens sent to ${address}</h1><a href="/">Back</a>`);
      } else {
        res.status(400).send('<h1>Please enter a valid address</h1><a href="/">Back</a>');
      }
    });
  } else {
    res.status(405).send('Method not allowed');
  }
}