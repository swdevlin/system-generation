const {determineDataKey, ORBIT_TYPES, computeBaseline} = require("./utils");
const MINIMUM_ALLOWABLE_ORBIT = require("./minimumAllowableOrbit");
const auToOrbit = require("./auToOrbit");
const {twoD6, d6} = require("./dice");
const starMass = require("./starMass");
const starDiameter = require("./starDiameter");
const starTemperature = require("./starTemperature");
const StarColour = require("./starColour");
const calculateStarEccentricity = require("./calculateStarEccentricity");
const Random = require("random-js").Random;

const r = new Random();

class Star {
  constructor(stellarClass, stellarType, subtype, orbitType) {
    this.stellarClass = stellarClass;
    if (stellarType === 'BD') {
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

    this.isCompanion = false;
    this.orbitType = orbitType;

    this.mass = starMass(this);

    this.diameter = starDiameter(this);

    this.temperature = starTemperature(this);

    const mainSequenceLifespan = 10/(this.mass**2.5);
    if (this.stellarClass === 'III') {
      this.age = mainSequenceLifespan;
      this.age += mainSequenceLifespan / (4/this.mass);
      this.age += mainSequenceLifespan / (10 * this.mass**3) * r.die(100)/100;
    } else if (this.stellarClass === 'IV') {
      this.age = mainSequenceLifespan / (4/this.mass);
      this.age = mainSequenceLifespan + this.age * r.die(100)/100;
    } else if (this.mass > 0.9) {
      this.age = mainSequenceLifespan * (r.die(6)-1/(r.die(6)/6))/6;
    } else {
      this.age = r.die(6)*2/(r.die(3) + r.die(10)/10);
    }
    if (this.mass < 4.7 && this.age < 0.01)
      this.age = 0.01;
    this.age = Math.round(this.age * 100) / 100;

    this.colour = StarColour[this.stellarType];

    if (orbitType === ORBIT_TYPES.PRIMARY)
      this.eccentricity = 0;
    else
      this.eccentricity = calculateStarEccentricity(this);

    this.companion = null;
    this.orbit = 0;
    this.period = 0;
    this.baseline = 0;

    this.totalObjects = 0;
    this.emptyOrbits = 0;
    this.spread = 1;

    this.availableOrbits = [];
    this.stellarObjects = [];
    this.orbitNumbers = [];
  }

  get dataKey() {
    return determineDataKey(this.stellarType, this.subtype);
  }

  get minimumAllowableOrbit() {
    if (this.stellarType === 'D')
      return 0.001;
    else {
      const mao = MINIMUM_ALLOWABLE_ORBIT[this.dataKey][this.stellarClass];
      if (this.companion)
        return Math.max(0.5 + this.companion.eccentricity, mao);
      else
        return mao;
    }
  }

  addStellarObject(item) {
    let i=0;
    while (i < this.stellarObjects.length && this.stellarObjects[i].orbit < item.orbit)
      i++;
    this.stellarObjects.splice(i,0,item);
  }

  get luminosity() {
    let luminosity= this.diameter**2 + (this.temperature/5772)**4;
    if (luminosity > 10)
      luminosity = Math.round(luminosity);
    else
      luminosity =  Math.round(luminosity * 100) / 100;
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
    if (!this.companion)
      orbits += 1;
    return Math.trunc(orbits);
  }

  orbitValid(orbit) {
    for (const range of this.availableOrbits)
      if (range[0] <= orbit && range[1] >= orbit)
        return true;
    return (orbit > this.availableOrbits.at(-1)[1])
  }

  assignOrbits() {
    this.baseline = computeBaseline(this);
    let baselineHZCO;
    if (this.baseline >= 1 && this.baseline <= this.totalObjects) {
      const div = (this.hzco < 1.0) ? 100 : 10;
      baselineHZCO = this.hzco + (twoD6()-7)/div;
    } else if (this.baseline < 1) {
      if (this.minimumAllowableOrbit >= 1.0)
        baselineHZCO = this.hzco - this.baseline + this.totalObjects + (twoD6()-2)/10;
      else
        baselineHZCO = this.minimumAllowableOrbit - this.baseline/10 + (twoD6()-2)/100;
    } else if (this.baseline > this.totalObjects) {
      if (this.hzco - this.baseline + this.totalObjects >= 1.0)
        baselineHZCO = this.hzco - this.baseline + this.totalObjects + (twoD6()-7)/5;
      else
        baselineHZCO = this.hzco - (this.baseline + this.totalObjects + (twoD6()-7)/5)/10;
      if (baselineHZCO < 0)
        baselineHZCO = Math.max(this.hzco - 0.1, this.minimumAllowableOrbit + this.totalObjects/100);
    }
    this.emptyOrbits = Math.max(0, twoD6()-9);

    this.spread = (baselineHZCO - this.minimumAllowableOrbit) / Math.max(1, this.baseline);
    if (this.spread * this.totalObjects > 20)
      this.spread = this.totalOrbits / (this.totalObjects + this.emptyOrbits);


    let orbit = this.minimumAllowableOrbit + this.spread + ((twoD6()-7) * this.spread)/10;
    this.orbitNumbers.push(orbit);
    for (let i=1; i <= this.totalObjects; i++) {
      orbit += this.spread + ((twoD6()-7) * this.spread)/10;
      while (!this.orbitValid(orbit))
        orbit += this.spread + ((twoD6()-7) * this.spread)/10;
      this.orbitNumbers.push(orbit);
    }
  }
}

module.exports = Star;
