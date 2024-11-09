const Atmosphere = require("../atmosphere/Atmosphere");
const StellarObject = require("../stellarObject");
const AtmosphereDensities = require("../atmosphere/AtmosphereDensities");
const Population = require("../population/Population");

class Moon extends StellarObject {
  constructor() {
    super();
    this.orbit = null;
    this.size = null;
    this.eccentricity = null;
    this.period = null;
    this.atmosphere = new Atmosphere();
    this.atmosphere.code = 0;
    this.atmosphere.density = AtmosphereDensities.NONE;
    this.hydrographics = { code: 0, distribution: null };
    this.governmentCode = 0;
    this.population = new Population();
    this.lawLevelCode = 0;
    this.biomassRating = 0;
    this.axialTilt = null;
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

}

module.exports = Moon;
