const consumerWrapper = require('./consumer-wrapper');
var express = require('express')


var http = require('http');

var app = express();

app.get('/nfc/out/:data', (req, res) => {
  console.log('NFC OFF', req.params.data)
  res.send('here is some data');

  // consumerWrapper().then(() => {
  //   console.log('SUCCESS')
  // }).catch(() => {
  //   console.error('error')
  // })
})

app.get('/nfc/:data', (req, res) => {
  console.log('NFC ON', req.params.data)
  res.send('here is some data');

  consumerWrapper().then(() => {
    console.log('PAYMENT DONE')
  }).catch(() => {
    console.error('PAYMENT FAILED')
  })
})
// const interface = "0.0.0.0";
const interface = "localhost";
http.createServer(app).listen(8080, interface);

console.log('started')
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})
