const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const Marantz = require('./night-mode-toggler');
const lirc = require('lirc_node');

const port = 8080;

// Returns landing page.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/main.css', (req, res) => {
  res.contentType('text/css');
  res.sendFile(path.join(__dirname + '/main.css'));
});

/**
 * Returns initial status of Marantz amp so UI can be updated.
 */
app.get('/status', (req, res) => {
  Marantz.getStatus((status) => {
    res.contentType('application/json');
    res.send(status);
  });
});

/**
 * Endpoints to modify Marantz amp.
 */
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

app.get('*', function(req, res) {
  fs.readFile('./' + req.params['0'], (err, data) => {
    if (err) {
      res.send('Oops! Couldn\'t find that file.');
    } else {
      res.contentType(req.params['0']);
      res.send(data);
    }
    res.end();
  });
});

app.listen(port, () => console.log(`Marantz app listening on port ${port}!`));

// Sets up listening to commands from LG remote.
lirc.init();

// Disable Voice
lirc.addListener('KEY_1', 'LG_AKB73715601', (data) => {
  Marantz.enableVoice();
}, 400);

// Enable Voice
lirc.addListener('KEY_2', 'LG_AKB73715601', (data) => {
  Marantz.disableVoice();
}, 400);

// Enable Night Mode
lirc.addListener('KEY_4', 'LG_AKB73715601', (data) => {
  Marantz.enableNightMode();
}, 400);

// Disable Night Mode
lirc.addListener('KEY_5', 'LG_AKB73715601', (data) => {
  Marantz.disableNightMode();
}, 400);
