const {ORBIT_TYPES, toHex, orbitText} = require("./utils");
const orbitToAU = require("./orbitToAU");

class TerrestrialPlanet {
  constructor(size, orbit) {
    this.size = size;
    this.orbit = orbit;
    this.period = 0;
    this.composition = '';
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

  get gravity() {
    return this.density * this.size / 8;
  }

  get mass() {
    return this.density * (this.size / 8)**3;
  }

  get escapeVelocity() {
    const v = Math.sqrt(this.mass / (this.diameter/12756)) * 11186;
    return v / 1000;
  }

  textDump(spacing, prefix, postfix) {
    const label = this.orbitType === ORBIT_TYPES.PLANETOID_BELT_OBJECT ? 'Belt significant body' : 'Terrestrial planet';
    return `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit)} X${toHex(this.size)}????? ${label}${postfix}\n`;
  }

}

module.exports = TerrestrialPlanet;
