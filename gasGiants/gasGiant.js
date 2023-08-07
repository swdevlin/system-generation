const {ORBIT_TYPES, orbitText} = require("../utils");
const {moonTextDump} = require("../moons");

class GasGiant {
  constructor(code, diameter, mass, orbit) {
    this.code = code;
    this.diameter = diameter;
    this.mass = mass;
    this.eccentricity = 0;
    this.orbit = orbit;
    this.moons = [];
    this.hasRing = false;
    this.orbitType = ORBIT_TYPES.GAS_GIANT;
    this.trojanOffset = null;
    this.axialTilt = 0;
  }

  textDump(spacing, prefix, postfix) {
    let s = `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit)} `;
    if (this.code === 'GS')
      s+= 'Small gas giant';
    else if (this.code === 'GM')
      s+= 'Medium gas giant';
    else if (this.code === 'GL')
      s+= 'Large gas giant';
    s += `${postfix}\n`;
    for (const moon of this.moons)
      s += moonTextDump(moon, spacing+2);
    return s;
  }
}

module.exports = GasGiant;
