const {determineDataKey, ORBIT_TYPES, computeBaseline, orbitText, AU, SOL_DIAMETER, orbitToAU, auToOrbit, StarColour,
  starIdentifier
} = require("../utils");
const {MINIMUM_ALLOWABLE_ORBIT} = require("./index");
const {twoD6, d6, d3, d10, d100} = require("../dice");
const starMass = require("./starMass");
const starDiameter = require("./starDiameter");
const starTemperature = require("./starTemperature");
const {starEccentricity} = require("./starEccentricity");

const Random = require("random-js").Random;
const r = new Random();

class Star {
  constructor(stellarClass, stellarType, subtype, orbitType) {
    this.stellarClass = stellarClass;
    this.totalObjects = 0;
    if (stellarType === 'BD') {
      this.stellarClass = '';
      switch (d6()) {
        case 1:
        case 2:
          this.stellarType = 'L';
          break;
        case 3:
        case 4:
          this.stellarType = 'T';
          break;
        case 5:
        case 6:
          this.stellarType = 'Y';
          break;
      }
      this.subtype = r.integer(0, 9);
    } else {
      this.stellarType = stellarType;
      this.subtype = subtype;
    }

    this.orbitType = orbitType;

    this.mass = starMass(this);

    this.diameter = starDiameter(this);

    this.temperature = starTemperature(this);

    const mainSequenceLifespan = 10 / (this.mass ** 2.5);
    if (this.stellarClass === 'III') {
      this.age = mainSequenceLifespan;
      this.age += mainSequenceLifespan / (4 / this.mass);
      this.age += mainSequenceLifespan / (10 * this.mass ** 3) * d100() / 100;
    } else if (this.stellarClass === 'IV') {
      this.age = mainSequenceLifespan / (4 / this.mass);
      this.age = mainSequenceLifespan + this.age * d100() / 100;
    } else if (this.mass > 0.9) {
      this.age = mainSequenceLifespan * (d6() - 1 / (d6() / 6)) / 6;
    } else {
      this.age = d6() * 2 / (d3() + d10() / 10);
    }
    if (this.mass < 4.7 && this.age < 0.01)
      this.age = 0.01;
    this.age = Math.round(this.age * 100) / 100;

    this.colour = StarColour[this.stellarType];

    if (orbitType === ORBIT_TYPES.PRIMARY)
      this.eccentricity = 0;
    else
      this.eccentricity = starEccentricity(this);

    this.companion = null;
    this.orbit = 0;
    this.period = 0;
    this.baseline = 0;

    this.totalObjects = 0;
    this.emptyOrbits = 0;
    this.spread = 1;

    this.availableOrbits = [];
    this.stellarObjects = [];
    this.occupiedOrbits = [];
    this.orbitSequence = '';
  }

  get dataKey() {
    return determineDataKey(this.stellarType, this.subtype);
  }

  get isCompanion() {
    return this.orbitType === ORBIT_TYPES.COMPANION;
  }

  get minimumAllowableOrbit() {
    if (this.stellarType === 'D')
      return 0;
    else {
      const mao = MINIMUM_ALLOWABLE_ORBIT[this.dataKey][this.stellarClass];
      if (this.companion)
        return Math.max(0.5 + this.companion.eccentricity, mao);
      else
        return mao;
    }
  }

  addStellarObject(item) {
    let i = 0;
    let mass = this.mass;
    if (this.companion)
      mass += this.companion.mass;
    while (i < this.stellarObjects.length && this.stellarObjects[i].orbit < item.orbit) {
      if (this.stellarObjects[i].orbitType < ORBIT_TYPES.GAS_GIANT)
        mass += this.stellarObjects[i].mass;
      i++;
    }
    this.stellarObjects.splice(i, 0, item);
    item.period = Math.sqrt(orbitToAU(item.orbit) ** 3 / mass);

  }

  get luminosity() {
    let luminosity = this.diameter ** 2 + (this.temperature / 5772) ** 4;
    if (luminosity > 10)
      luminosity = Math.round(luminosity);
    else
      luminosity = Math.round(luminosity * 100) / 100;
    return luminosity;
  }

  get hzco() {
    let luminosity = this.luminosity;
    if (this.companion)
      luminosity += this.companion.luminosity;
    const d = Math.sqrt(luminosity);
    return auToOrbit(d);
  }

  get totalOrbits() {
    let orbits = 0;
    for (const o of this.availableOrbits)
      orbits += o[1] - o[0];
    if (orbits > 0 && !this.companion)
      orbits += 1;
    return Math.trunc(orbits);
  }

  orbitValid(orbit) {
    if (this.availableOrbits.length === 0)
      return false;
    for (const range of this.availableOrbits)
      if (range[0] <= orbit && range[1] >= orbit)
        return true;
    return (orbit > this.availableOrbits.at(-1)[1])
  }

  assignOrbits() {
    this.baseline = computeBaseline(this);
    if (this.availableOrbits.length === 0)
      return;
    let baselineOrbitNumber;
    if (this.baseline >= 1 && this.baseline <= this.totalObjects) {
      const div = (this.hzco < 1.0) ? 100 : 10;
      baselineOrbitNumber = this.hzco + (twoD6() - 7) / div;
    } else if (this.baseline < 1) {
      if (this.minimumAllowableOrbit >= 1.0)
        baselineOrbitNumber = this.hzco - this.baseline + this.totalObjects + (twoD6() - 2) / 10;
      else
        baselineOrbitNumber = this.minimumAllowableOrbit - this.baseline / 10 + (twoD6() - 2) / 100;
    } else if (this.baseline > this.totalObjects) {
      if (this.hzco - this.baseline + this.totalObjects >= 1.0)
        baselineOrbitNumber = this.hzco - this.baseline + this.totalObjects + (twoD6() - 7) / 5;
      else
        baselineOrbitNumber = this.hzco - (this.baseline + this.totalObjects + (twoD6() - 7) / 5) / 10;
      if (baselineOrbitNumber < 0)
        baselineOrbitNumber = Math.max(this.hzco - 0.1, this.minimumAllowableOrbit + this.totalObjects / 100);
    }
    this.emptyOrbits = Math.max(0, twoD6() - 9);

    this.spread = (baselineOrbitNumber - this.minimumAllowableOrbit) / Math.max(1, this.baseline);
    if (this.spread <= 0)
      this.spread = this.minimumAllowableOrbit / Math.max(1, this.baseline);
    if (this.spread * this.totalObjects > 20)
      this.spread = this.totalOrbits / (this.totalObjects + this.emptyOrbits);
    let orbit = this.minimumAllowableOrbit + this.spread + ((twoD6() - 7) * this.spread) / 10;
    this.occupiedOrbits.push(orbit);
    for (let i = 1; i < this.totalObjects + this.emptyOrbits; i++) {
      orbit += this.spread + ((twoD6() - 7) * this.spread) / 10;
      while (!this.orbitValid(orbit))
        orbit += this.spread + ((twoD6() - 7) * this.spread) / 10;
      this.occupiedOrbits.push(orbit);
    }
  }

  orbitAdjacentToUnavailabilityZone(orbit) {
    if (this.availableOrbits.length === 0)
      return false;

    if (this.availableOrbits[0][1] - this.spread < orbit)
      return true;

    for (let i = 1; i < this.availableOrbits.length; i++) {
      if (this.availableOrbits[i][0] - this.spread < orbit)
        return true;
      if (this.availableOrbits[i][1] + this.spread > orbit)
        return true;
    }
    return false;
  }

  orbitAdjacentToOuterMostUnavailability(orbit) {
    if (this.availableOrbits.length === 0)
      return false;

    for (const so of this.stellarObjects)
      if (so.orbitType === ORBIT_TYPES.FAR)
        return this.availableOrbits[this.availableOrbits.length - 1][1] + this.spread > orbit;

    return false;
  }

  textDump(spacing, prefix, postfix, index, starIndex) {
    const jumpShadow = 100 * this.diameter * SOL_DIAMETER / AU;
    this.jump = auToOrbit(jumpShadow);
    let displayedJump = false;
    let s = `${' '.repeat(spacing)}`;
    if (this.orbitType !== ORBIT_TYPES.PRIMARY) {
      s += `${orbitText(this.orbit)} ${starIdentifier(starIndex)} `;
      this.orbitSequence = starIdentifier(starIndex);
    } else
      this.orbitSequence = 'A';
    if (this.stellarType === 'D')
      s += `${prefix}✸ White dwarf${postfix}\n`;
    else {
      s += `${prefix}✸ ${this.stellarType}${this.subtype} ${this.stellarClass}${postfix}\n`;
      let index = 0;
      let starCount = 0;
      for (const stellar of this.stellarObjects) {
        index++;
        if (stellar.orbit > this.jump && !displayedJump) {
          s += `${' '.repeat(spacing + 2)}^^^ ${jumpShadow.toFixed(2)} ^^^\n`;
          displayedJump = true;
        }
        const dumpParams = [spacing + 2, '', '', index, starIndex];
        if (Math.abs(this.hzco - stellar.orbit) <= 0.2) {
          dumpParams[1] = '>>';
          dumpParams[2] = '<<';
        } else if (Math.abs(this.hzco - stellar.orbit) <= 1) {
          dumpParams[1] = '>';
          dumpParams[2] = '<';
        }
        if (stellar instanceof Star) {
          starCount++;
          dumpParams[3] = 0;
          starIndex.push(starCount);
        }
        s += stellar.textDump(...dumpParams);
        if (stellar instanceof Star)
          starIndex.pop();
      }
    }
    return s;
  }

  htmlDump(additionalClass) {
    if (additionalClass === undefined)
      additionalClass = '';
    let lines = [];
    this.jump = auToOrbit(100 * this.diameter * SOL_DIAMETER / AU);
    let displayedJump = false;
    let s = '';
    if (this.orbitType !== ORBIT_TYPES.PRIMARY)
      s = `<span class="orbit">${orbitText(this.orbit)}`;
    if (this.stellarType === 'D')
      s += `<span class="star">White Dwarf</span>`;
    else
      s += `<span class="star">${this.stellarType}${this.subtype} ${this.stellarClass}</span>`;
    if (this.orbitType !== ORBIT_TYPES.PRIMARY)
      lines.push(`<li class="${additionalClass}">${s}</li>`);
    else
      lines.push(`<div class="${additionalClass}">${s}</div>`);
    lines.push('<ul>');
    for (const stellar of this.stellarObjects) {
      if (stellar.orbit > this.jump && !displayedJump) {
        lines.push('<li><hr/></li>');
        displayedJump = true;
      }
      let habitableClass = '';
      if (Math.abs(this.hzco - stellar.orbit) <= 0.2)
        habitableClass = 'habitable';
      else if (Math.abs(this.hzco - stellar.orbit) <= 1)
        habitableClass = 'fringe';
      else if (this.hzco < stellar.orbit)
        habitableClass = 'outside';
      else
        habitableClass = 'inside';
      // lines.push(`<li class="${habitableClass}">`);
      lines = lines.concat(stellar.htmlDump(habitableClass));
      // lines.push(`</li>`);
    }
    lines.push('</ul>');
    return lines;
  }
}

module.exports = Star;
