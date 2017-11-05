const consumerWrapper = require('./consumer-wrapper');
var express = require('express')


var http = require('http');

var app = express();

app.get('/nfc', (req, res) => {
  console.log('NFC data received', req.query.data)
  res.send('Here is some data!');

  consumerWrapper().then(() => {
    console.log('SUCCESS')
  }).catch(() => {
    console.error('error')
  })
})
// const interface = "0.0.0.0";
const interface = "localhost";
http.createServer(app).listen(8080, interface);


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})
