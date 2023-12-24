const {ORBIT_TYPES, orbitText, sequenceIdentifier} = require("../utils");
const {moonTextDump} = require("../moons");
const StellarObject = require("../stellarObject");

class GasGiant extends StellarObject {
  constructor(code, diameter, mass, orbit) {
    super();
    this.code = code;
    this.diameter = diameter;
    this.mass = mass;
    this.orbit = orbit;
    this.moons = [];
    this.hasRing = false;
    this.orbitType = ORBIT_TYPES.GAS_GIANT;
    this.trojanOffset = null;
    this.axialTilt = 0;
  }

  textDump(spacing, prefix, postfix, index, starIndex) {
    this.orbitSequence = sequenceIdentifier(index, starIndex);
    let s = `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit, index, starIndex)} `;
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
