const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/invoices/1',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', res.headers);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('BODY', data);
  });
});

req.on('error', (err) => {
  console.error('ERROR', err.message);
});
req.end();
