const {ORBIT_TYPES} = require("./utils");

class PlanetoidBelt {
  constructor(orbit) {
    this.orbit = orbit;
    this.moons = [];
    this.orbitType = ORBIT_TYPES.PLANETOID_BELT;
  }

  textDump(spacing, prefix, postfix) {
    return `${' '.repeat(spacing)}${prefix}${this.orbit.toFixed(2)} Planetoid belt${postfix}\n`;
  }
}

module.exports = PlanetoidBelt;
