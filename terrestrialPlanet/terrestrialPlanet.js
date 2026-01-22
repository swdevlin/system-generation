const {ORBIT_TYPES, toHex, orbitText, sequenceIdentifier, deconstructUWP} = require("../utils");
const StellarObject = require("../stellarObject");
const Atmosphere = require("../atmosphere/Atmosphere");
const moonTextDump = require("../moons/moonTextDump");
const {determineTaint} = require("../atmosphere/taint");
const Population = require("../population/Population");
const {randomInt} = require("../dice");

const SIZE_STEP = 1600;
class TerrestrialPlanet extends StellarObject {
  constructor(size, orbit, uwp) {
    super();

    this.sizeVariance = randomInt(SIZE_STEP/2 - SIZE_STEP, SIZE_STEP + SIZE_STEP/2);
    const components = uwp ? deconstructUWP(uwp) : null;
    this.fromUWP = components !== null;
    this.size = components ? components.size : size;
    this.orbit = orbit;
    if (orbit)
      this.period = 0;
    this.composition = '';
    this.retrograde = false;
    this.trojanOffset = null;
    this.axialTilt = 0;
    this.moons = [];
    this.biomassRating = 0;
    this.biocomplexityCode = 0;
    this.biodiversityRating = 0;
    this.compatibilityRating = 0;
    this.resourceRating = 2;
    this.hasRing = false;
    this.orbitType = ORBIT_TYPES.TERRESTRIAL;
    this.atmosphere = new Atmosphere();
    if (components) {
      this.atmosphere.code = components.atmosphere;
      if ([2,4,7,9].includes(components.atmosphere))
        this.atmosphere.taint = determineTaint(this.atmosphere);
      // todo: 10+
    }
    this.hydrographics = {
      code: components ? components.hydrographics : null,
      distribution: null
    };
    this.population = new Population();
    this.population.code = components ? components.population : 0;
    this.governmentCode = components ? components.government : 0;
    this.lawLevelCode = components ? components.lawLevel : 0;
    this.starPort = components ? components.starPort : 'X';
    this.techLevel = components ? components.techLevel : 0;
    this.tradeCodes = [];
    this.albedo = 0;
  }

  get uwp() {
    return `${this.starPort}${toHex(this.size)}${toHex(this.atmosphere.code)}${toHex(this.hydrographics.code)}${toHex(this.population.code)}${toHex(this.governmentCode)}${toHex(this.lawLevelCode)}-${toHex(this.techLevel)}`;
  }

  get diameter() {
    const sizeStep = 1600;
    if (this.size === 0)
      return 0;
    else if (this.size === 'R')
      return 0;
    else if (this.size === 'S')
      return 600 + this.sizeVariance / 4;
    else
      return this.size * sizeStep + this.sizeVariance;
  }

  get gravity() {
    return this.density * this.diameter / 12756;
  }

  get mass() {
    return this.density * (this.diameter / 12756)**3;
  }

  get escapeVelocity() {
    const v = Math.sqrt(this.mass / (this.diameter/12756)) * 11186;
    return v / 1000;
  }

  textDump(spacing, prefix, postfix, index, starIndex) {
    this.orbitSequence = sequenceIdentifier(index, starIndex);
    const label = this.orbitType === ORBIT_TYPES.PLANETOID_BELT_OBJECT ? 'Belt significant body' : 'Terrestrial planet';
    let s = `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit, index, starIndex)} X${toHex(this.size)}${toHex(this.atmosphere.code)}${toHex(this.hydrographics.code)}${toHex(this.population.code)}${toHex(this.governmentCode)}${toHex(this.lawLevelCode)} ${label}; j: ${this.safeJumpTime(4)}${postfix}\n`;
    for (const moon of this.moons)
      s += moonTextDump(moon, spacing+2);
    return s;
  }

}

module.exports = TerrestrialPlanet;
