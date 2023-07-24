const {ORBIT_TYPES} = require("./utils");

class TerrestrialPlanet {
  constructor(size, mass, orbit) {
    this.size = size;
    this.mass = mass;
    this.orbit = orbit;
    this.moons = [];
    this.orbitType = ORBIT_TYPES.TERRESTRIAL;
  }

  get diameter() {
    if (this.size === 0)
      return 0;
    if (this.size === 'R')
      return 0;
    if (this.size === 'S')
      return 600;
    return this.size * 1600;
  }

  textDump(spacing, prefix, postfix) {
    return `${' '.repeat(spacing)}${prefix}${this.orbit.toFixed(2)} Terrestrial planet${postfix}\n`;
  }

}

module.exports = TerrestrialPlanet;
