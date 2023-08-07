const {ORBIT_TYPES, toHex, orbitText} = require("../utils");
const {moonTextDump} = require("../moons");

class TerrestrialPlanet {
  constructor(size, orbit) {
    this.size = size;
    this.orbit = orbit;
    this.period = 0;
    this.composition = '';
    this.eccentricity = 0;
    this.inclination = 0;
    this.retrograde = false;
    this.trojanOffset = null;
    this.axialTilt = 0;
    this.moons = [];
    this.hasRing = false;
    this.orbitType = ORBIT_TYPES.TERRESTRIAL;
    this.atmosphere = {code: 0, irritant: false, characteristic: ''};
    this.hydrographics = {code: 0};
    this.populationCode = 0;
    this.governmentCode = 0;
    this.lawLevelCode = 0;
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
    let s = `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit)} X${toHex(this.size)}${toHex(this.atmosphere.code)}${toHex(this.hydrographics.code)}${toHex(this.populationCode)}${toHex(this.governmentCode)}${toHex(this.lawLevelCode)} ${label}${postfix}\n`;
    for (const moon of this.moons)
      s += moonTextDump(moon, spacing+2);
    return s;
  }

}

module.exports = TerrestrialPlanet;
