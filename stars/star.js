const {
  determineDataKey,
  ORBIT_TYPES,
  computeBaseline,
  orbitText,
  AU,
  SOL_DIAMETER,
  orbitToAU,
  auToOrbit,
  StarColour,
  starIdentifier,
  STELLAR_TYPES,
  isAnomaly,
  isBrownDwarf, sequenceIdentifier
} = require("../utils");
const {MINIMUM_ALLOWABLE_ORBIT} = require("./index");
const {twoD6, d6, d3, d10, d100} = require("../dice");
const starMass = require("./starMass");
const starDiameter = require("./starDiameter");
const starTemperature = require("./starTemperature");
const {starEccentricity} = require("./starEccentricity");
const computeBaselineOrbitNumber = require("./computeBaselineOrbitNumber");
const StellarObject = require("../stellarObject");


class Star extends StellarObject {
  constructor(classification, orbitType) {
    super();
    this.stellarClass = classification.stellarClass;
    this.stellarType = classification.stellarType;
    this.isProtostar = classification.isProtostar;
    this.subtype = classification.subtype;

    this.totalObjects = 0;
    this.orbitType = orbitType;

    this.mass = starMass(this);
    if (this.stellarType === 'BD') {
      if (this.mass >= 0.08) {
        this.stellarType = 'L';
        this.subtype = 0;
      } else if (this.mass >= 0.06) {
        this.stellarType = 'L';
        this.subtype = 5;
      } else if (this.mass >= 0.05) {
        this.stellarType = 'T';
        this.subtype = 0;
      } else if (this.mass >= 0.04) {
        this.stellarType = 'T';
        this.subtype = 5;
      } else if (this.mass >= 0.025) {
        this.stellarType = 'Y';
        this.subtype = 0;
      } else {
        this.stellarType = 'Y';
        this.subtype = 5;
      }
    }

    try {
      this.diameter = starDiameter(this);
    } catch (e) {
      console.log(JSON.stringify(classification, null, 2));
      throw e;
    }

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
    if (this.colour === undefined)
      this.colour = null;

    if (orbitType !== ORBIT_TYPES.PRIMARY)
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

  get minimumOrbit() {
    if (this.availableOrbits.length > 0)
      return this.availableOrbits[0][0];
    else
      return null;
  }

  get isAnomaly() {
    return [
      STELLAR_TYPES.Anomaly,
      STELLAR_TYPES.BlackHole,
      STELLAR_TYPES.BrownDwarf,
      'L', 'T', 'Y',
      STELLAR_TYPES.Nebula,
      STELLAR_TYPES.NeutronStar,
      STELLAR_TYPES.Protostar,
      STELLAR_TYPES.Pulsar,
      STELLAR_TYPES.StarCluster,
      STELLAR_TYPES.WhiteDwarf,
    ].includes(this.stellarType)

  }

  get dataKey() {
    return determineDataKey(this.stellarType, this.subtype);
  }

  get isCompanion() {
    return this.orbitType === ORBIT_TYPES.COMPANION;
  }

  get minimumAllowableOrbit() {
    if (this.stellarType === STELLAR_TYPES.WhiteDwarf)
      return 0;
    else if (this.stellarType === STELLAR_TYPES.NeutronStar)
      return 0.001;
    else if (isAnomaly(this.stellarType) && !isBrownDwarf(this.stellarType))
      return 0.0;
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
    item.period = Math.sqrt(orbitToAU(item.orbit) ** 3 / mass) * 365.25;
  }

  get luminosity() {
    return (this.diameter ** 2) * ((this.temperature / 5772) ** 4);
  }

  get totalLuminosity() {
    let l = this.luminosity;
    if (this.companion)
      l += this.companion.luminosity;
    return l;
  }

  get hzco() {
    let luminosity = this.luminosity;
    if (this.companion)
      luminosity += this.companion.luminosity;
    const d = Math.sqrt(luminosity);
    return auToOrbit(d);
  }

  get jumpShadow() {
    return 100 * this.diameter * SOL_DIAMETER;
  }

  get totalOrbits() {
    let orbits = 0;
    for (const o of this.availableOrbits)
      orbits += o[1] - o[0];
    if (orbits > 0 && !this.companion)
      orbits += 1;
    return Math.trunc(orbits);
  }

  debugOrbits() {
    let orbits = 0;
    for (const o of this.availableOrbits) {
      console.log(o);
      orbits += o[1] - o[0];
    }
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

  assignOrbits(primary) {
    this.baseline = computeBaseline(this);
    if (this.availableOrbits.length === 0)
      return;

    let baselineOrbitNumber = computeBaselineOrbitNumber(this);

    this.emptyOrbits = Math.max(0, twoD6() - 9);

    this.spread = (baselineOrbitNumber - this.minimumAllowableOrbit) / Math.max(1, this.baseline);

    if (this.spread <= 0)
      this.spread = this.minimumAllowableOrbit / Math.max(1, this.baseline);

    const possibleOrbits = this.availableOrbits.reduce((orbits, range) => {
      return orbits + range[1]-range[0];
    }, 0);

    // if (this.spread * (this.totalObjects + this.emptyOrbits) > 20)
    if (this.spread * (this.totalObjects + this.emptyOrbits) > possibleOrbits)
      if (this.orbit === 0)
        this.spread = possibleOrbits / (this.totalObjects + this.emptyOrbits);
      else
        this.spread = possibleOrbits / (this.totalObjects + this.emptyOrbits + 1);

    this.markOccupiedOrbits();
  }

  nextAvailableOrbit(orbit) {
    const dr = twoD6();
    let orbitOffet = this.spread + ((dr - 7) * this.spread) / 10;
    for (const range of this.availableOrbits)
      if (range[0] >= orbit) {
        return Math.max(range[0], range[0] + orbitOffet);
      } else if (range[0] <= orbit && range[1] >= orbit) {
        return orbit + orbitOffet;
      }
    return orbit + orbitOffet;

  }
  markOccupiedOrbits() {
    let orbit = this.minimumAllowableOrbit + this.spread + ((twoD6() - 7) * this.spread) / 10;
    this.occupiedOrbits.push(orbit);
    for (let i = 1; i < this.totalObjects + this.emptyOrbits; i++) {
      orbit = this.nextAvailableOrbit(orbit);
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
    this.jump = auToOrbit(this.jumpShadow);
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
          s += `${' '.repeat(spacing + 2)}^^^ ${this.jumpShadow.toFixed(2)} ^^^\n`;
          displayedJump = true;
        }
        const dumpParams = [spacing + 2, '', '', index, starIndex];
        if (Math.abs(stellar.hzcoDeviation) <= 0.2) {
          dumpParams[1] = '🌐 ';
          dumpParams[2] = '';
        } else if (Math.abs(stellar.hzcoDeviation) <= 1) {
          if (stellar.hzcoDeviation > 0) {
            dumpParams[1] = '🔥 ';
            dumpParams[2] = '';
          } else {
            dumpParams[1] = '❄ ';
            dumpParams[2] = '';
          }
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

  resetNonStarBodies(totalObjects) {
    this.totalObjects = totalObjects;
    for (let i = this.stellarObjects.length - 1; i >= 0; i--)
      if (this.stellarObjects[i].orbitType >= 10)
        this.stellarObjects.splice(i, 1);
    this.occupiedOrbits = [];
    this.assignOrbits();
  }

  nextOrbit(body, orbitIndex) {
    if (body.orbit) {
      if (body.orbit === 'outer') {
        while (this.occupiedOrbits[orbitIndex] <= this.hzco+1)
          orbitIndex++;
      } else if (body.orbit === 'inner') {
        while (this.occupiedOrbits[orbitIndex + 1] < this.hzco-1)
          orbitIndex++;
      } else if (body.orbit === 'warm') {
        while (this.occupiedOrbits[orbitIndex] < this.hzco - 1)
          orbitIndex++;
      } else if (body.orbit === 'cold') {
        while (this.occupiedOrbits[orbitIndex+1] < this.hzco + 1)
          orbitIndex++;
      } else if (body.orbit === 'habitable') {
        while (this.occupiedOrbits[orbitIndex+1] < this.hzco + 1)
          orbitIndex++;
      } else {
        throw(`Invalid orbit specified: ${body.orbit}`)
      }
    } else
      orbitIndex++;

    return orbitIndex;
  }

  assignOrbitSequences(orbiting) {
    if (this.stellarType === 'D')
      return;
    this.jump = auToOrbit(this.jumpShadow);
    switch (this.orbitType) {
      case ORBIT_TYPES.PRIMARY:
        this.orbitSequence = 'A';
        break;
      case ORBIT_TYPES.CLOSE:
        this.orbitSequence = 'B';
        break;
      case ORBIT_TYPES.NEAR:
        this.orbitSequence = 'C';
        break;
      case ORBIT_TYPES.FAR:
        this.orbitSequence = 'D';
        break;
    }
    if (this.companion)
      this.companion.orbitSequence = this.orbitSequence + 'b';
    orbiting += this.orbitSequence;
    let index = 0;
    for (const stellar of this.stellarObjects) {
      if (stellar instanceof Star) {
        stellar.assignOrbitSequences('');
        orbiting += stellar.orbitSequence;
      } else {
        index++;
        let od = this.companion && orbiting.length === 1 ? orbiting + 'ab' : orbiting;
        stellar.orbitSequence = sequenceIdentifier(od, index);
      }
    }
  }

}

module.exports = Star;
