const {ORBIT_TYPES, orbitText} = require("../utils");

class PlanetoidBelt {
  constructor(orbit) {
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
  }

  textDump(spacing, prefix, postfix) {
    return `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit)} Planetoid belt${postfix}\n`;
  }

  htmlDump(additionalClass) {
    if (additionalClass === undefined)
      additionalClass = '';

    return [`<li class="planetoid ${additionalClass}"><span class="orbit">${orbitText(this.orbit)}</span>X000000 Planetoid belt</li>`];
  }
}

module.exports = PlanetoidBelt;
