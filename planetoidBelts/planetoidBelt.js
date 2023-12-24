const {ORBIT_TYPES, orbitText, sequenceIdentifier, toHex} = require("../utils");
const StellarObject = require("../stellarObject");

class PlanetoidBelt extends StellarObject {
  constructor(orbit) {
    super();
    this.orbit = orbit;
    this.moons = [];
    this.orbitType = ORBIT_TYPES.PLANETOID_BELT;
    this.mType = 0;
    this.sType = 0;
    this.cType = 0;
    this.oType = 0;
    this.span = null;
    this.bulk = null;
    this.resourceRating = null;
    this.significantBodies = [];
    this.atmosphere = {
      code: 0,
      irritant: false,
      characteristic: ''
    };
    this.hydrographics = {
      code: 0,
      distribution: null
    };
    this.populationCode = 0;
    this.governmentCode = 0;
    this.lawLevelCode = 0;
    this.starPort = 'X';
    this.techLevel = 0;
    this.size = 0;
  }

  textDump(spacing, prefix, postfix, index, starIndex) {
    this.orbitSequence = sequenceIdentifier(index, starIndex);
    return `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit, index, starIndex)} Planetoid belt${postfix}\n`;
  }

  get uwp() {
    return `${this.starPort}${toHex(this.size)}${toHex(this.atmosphere.code)}${toHex(this.hydrographics.code)}${toHex(this.populationCode)}${toHex(this.governmentCode)}${toHex(this.lawLevelCode)}-${this.techLevel}`;
  }

}

module.exports = PlanetoidBelt;
