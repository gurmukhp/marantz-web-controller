const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const Marantz = require('./night-mode-toggler');

const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/main.css', (req, res) => {
  res.contentType('text/css');
  res.sendFile(path.join(__dirname + '/main.css'));
});

app.get('/enableVoice', (req, res) => {
  Marantz.enableVoice();
  res.send('enhance voice enabled');
});

app.get('/disableVoice', (req, res) => {
  Marantz.disableVoice();
  res.send('enhance voice disabled');
});

app.get('/enableNightMode', (req, res) => {
  Marantz.enableNightMode();
  res.send('night mode enabled');
});

app.get('/disableNightMode', (req, res) => {
  Marantz.disableNightMode();
  res.send('night mode disabled');
});

app.get('/status', (req, res) => {
  Marantz.getStatus((status) => {
    res.contentType('application/json');
    res.send(status);
  });
});

app.get('*', function(req, res) {
  // Note: should use a stream here, instead of fs.readFile
  fs.readFile('./' + req.params['0'], (err, data) => {
    if(err) {
      res.send("Oops! Couldn't find that file.");
    } else {
      // set the content type based on the file
      res.contentType(req.params['0']);
      res.send(data);
    }   
    res.end();
  }); 
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));