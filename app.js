const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const NightModeToggler = require('./night-mode-toggler');

const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/main.css', (req, res) => {
  res.contentType('text/css');
  res.sendFile(path.join(__dirname + '/main.css'));
});

app.get('/enableNightMode', (req, res) => {
  NightModeToggler.enable();
  res.send('night mode enabled');
});

app.get('/disableNightMode', (req, res) => {
  NightModeToggler.disable();
  res.send('night mode disabled');
});

app.get('/status', (req, res) => {
  NightModeToggler.isEnabled((enabled) => {
    res.contentType('application/json');
    res.send({
      enabled: enabled
    });
  });
});

app.get('*', function(req, res) {
  // Note: should use a stream here, instead of fs.readFile
  fs.readFile('./' + req.params['0'], function(err, data) {
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