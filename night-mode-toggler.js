'use strict'

const Marantz = require('marantz-denon-telnet');

class NightModeToggler {
  constructor() {
    this.marantzAvr = new Marantz('192.168.86.91');
    this.status;
    this.updateState();
  }

  updateState() {
    this.getStatus((status) => {
      this.nightModeEnabled = status.night;
      this.enhanceVoiceEnabled = status.voice;
    });
  }

  /**
   * Sync amp status locally.
   */
  getStatus(callback) {
    this.status = {
      voice: false,
      night: false
    };
    // Check if Dynamic Eq is on.
    this.marantzAvr.telnet('PSDYNEQ ?', (error, response) => {
      console.log(response);
      if (response[0] === 'PSDYNEQ ON') {
        // Do nothing
        callback(this.status);
      } else {
        this.status.voice = true;
        this.marantzAvr.telnet('PSBAS ?', (error, response) => {
          if (response[0] === 'PSBAS 44') {
            this.status.night = true;
          }
          callback(this.status);
        });
      }
    });
  }

  // Sync local status to amp.
  setStatus() {
    // Night: OFF and Voice: OFF
    if (!this.status.night && !this.status.voice) {
      this.marantzAvr.telnet('PSDYNEQ ON', (error, response) => {});
    }
    // Night: OFF and Voice: ON
    else if (!this.status.night && this.status.voice) {
      this.marantzAvr.telnet('PSDYNEQ OFF', (error, response) => {
        this.marantzAvr.telnet('PSBAS 56', (error, response) => {});
      });
    }
    // Night: ON and Voice: OFF OR Night: ON and Voice: ON
    else {
      this.marantzAvr.telnet('PSDYNEQ OFF', (error, response) => {
        this.marantzAvr.telnet('PSBAS 44', (error, response) => {});
      });
    }
  }

  enableVoice() {
    this.status.voice = true;
    this.setStatus();
  }

  disableVoice() {
    this.status.voice = false;
    this.setStatus();
  }

  enableNightMode() {
    this.status.night = true;
    this.setStatus();
  }

  disableNightMode() {
    this.status.night = false;
    this.setStatus();
  }
}

module.exports = new NightModeToggler;