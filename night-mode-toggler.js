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
   * If MultiEq is OFF, then NightMode is enabled.
   */
  isEnabled(callback) {
    this.marantzAvr.telnet('PSMULTEQ: ?', (error, response) => {
      if (response[0] === 'PSMULTEQ:OFF') {
        callback(true);
      }
      else {
        callback(false);
      }
    })
  }

  enable() {
    if (this.enabled) {
      return;
    }
    this.marantzAvr.telnet('PSMULTEQ:OFF', () => {
      this.marantzAvr.telnet('PSGEQ ON', () => {});
    });
    this.enabled = true;
  }

  disable() {
    if (!this.enabled) {
      return;
    }
    this.marantzAvr.telnet('PSGEQ OFF', () => {
      this.marantzAvr.telnet('PSMULTEQ:FLAT', () => {
        this.marantzAvr.telnet('PSDYNVOL LIT', () => {});
      });
    });
    this.enabled = false;
  }
}

module.exports = new NightModeToggler;