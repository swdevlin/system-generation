'use strict';

class TechLevel {
  constructor() {
    this.code = 0;
    this.dm = null;
    this.environmentMinTechLevel = null;
    this.min = null;
    this.max = null;
    this.floorExceededCeiling = false;
    this.energy = null;
    this.electronics = null;
    this.manufacturing = null;
    this.medical = null;
    this.environmental = null;
    this.landTransport = null;
    this.waterTransport = null;
    this.airTransport = null;
    this.spaceTransport = null;
    this.personalMilitary = null;
    this.heavyMilitary = null;
  }
}

module.exports = TechLevel;
