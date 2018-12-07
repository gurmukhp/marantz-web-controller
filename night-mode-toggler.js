'use strict'

const Marantz = require('marantz-denon-telnet');

class NightModeToggler {
  constructor() {
    this.marantzAvr = new Marantz('192.168.86.91');
    this.enabled = false;
    this.updateState();
  }

  updateState() {
    this.isEnabled((enabled) => {
      this.enabled = enabled;
    });
  }

  /**
   * If Bass is -6 then Night mode is on.
   */
  isEnabled(callback) {
    this.marantzAvr.telnet('PSBAS ?', (error, response) => {
      console.log(error);
      console.log(response);
      if (response[0] === 'PSBAS 44') {
        callback(true);
      }
      else {
        callback(false);
      }
    })
  }

  enable() {
    console.log('enable');
    if (this.enabled) {
      return;
    }
    this.marantzAvr.telnet('PSBAS 44', () => {});
    this.enabled = true;
  }

  disable() {
    console.log('disable');
    if (!this.enabled) {
      return;
    }
    this.marantzAvr.telnet('PSBAS 56', () => {});
    this.enabled = false;
  }
}

module.exports = new NightModeToggler;