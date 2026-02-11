const { ORBIT_TYPES, orbitText, sequenceIdentifier } = require('../utils');
const StellarObject = require('../stellarObject');
const moonTextDump = require('../moons/moonTextDump');
const { twoD6, d6 } = require('../dice');
const densityIndexDM = require('../utils/densityIndexDM');

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
    if (this.code === 'GS') s += 'Small gas giant';
    else if (this.code === 'GM') s += 'Medium gas giant';
    else if (this.code === 'GL') s += 'Large gas giant';
    s += `; j: ${this.safeJumpTime(4)}`;
    s += `${postfix}\n`;
    for (const moon of this.moons) s += moonTextDump(moon, spacing + 2);
    return s;
  }
}

const gasGiantQuantity = (solarSystem, densityIndex) => {
  let gasGiants = 0;
  let dm;
  if (d6() > 1) {
    if (solarSystem.stars.length === 1 && solarSystem.primaryStar.stellarClass === 'V') dm = 1;
    else if (solarSystem.starCount > 3) dm = -1;
    else dm = 0;

    dm += densityIndexDM(densityIndex);

    const roll = twoD6() + dm;
    if (roll <= 4) gasGiants = 1;
    else if (roll <= 6) gasGiants = 2;
    else if (roll <= 8) gasGiants = 3;
    else if (roll <= 11) gasGiants = 4;
    else if (roll <= 12) gasGiants = 5;
    else gasGiants = 6;
  }
  return gasGiants;
};

module.exports = {
  GasGiant,
  gasGiantQuantity,
};
