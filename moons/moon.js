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

}

module.exports = Moon;
