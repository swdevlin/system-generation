const AtmosphereDensities = require('./AtmosphereDensities');
const { Taint } = require('./taint');

class Atmosphere {
  constructor() {
    this.code = null;
    this.irritant = false;
    this.taint = new Taint();
    this.characteristic = '';
    this.bar = 0;
    this.gasType = null;
    this.subtype = null;
    this.gases = [];
    this.composition = null;

    this.density = AtmosphereDensities.STANDARD;
    this.hazardCode = null;
  }
}

module.exports = Atmosphere;
