const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const apiUrl = process.argv[2];
const path = require('path')

if (!apiUrl) {
  throw 'api url is missing'
}

app.use('/api', proxy(apiUrl));
app.use('/', express.static('app'));

app.get('*', function(req, res) {
  res.sendFile('index.html',{
    root: path.join(__dirname, 'app')
  });
})

app.listen(8080)
