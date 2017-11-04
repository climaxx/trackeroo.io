var express = require('express')


var http = require('http');

var app = express();

app.get('/nfc/out/:data', (req, res) => {
  res.json({ name: 'Test User', message: "Who is your daddy?", status: Math.random() > 0.5 });
  // console.log('RECEIVED NFC DATA', res.params.data)
})

app.get('/nfc/:data', (req, res) => {
  res.json({ name: 'Mihai Popescu', message: "Who is your daddy?", isOk: Math.random() > 0.5 });
  console.log('RECEIVED NFC DATA', req.params.data)
})

// const interface = "0.0.0.0";
const interface = "localhost";
http.createServer(app).listen(8081, interface);

console.log('started on port GET: http://localhost:8081/nfc/')

