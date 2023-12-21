const Atmosphere = require("../atmosphere/Atmosphere");
const StellarObject = require("../stellarObject");

class Moon extends StellarObject {
  constructor() {
    super();
    this.orbit = null;
    this.size = null;
    this.eccentricity = null;
    this.period = null;
    this.atmosphere = new Atmosphere();
    this.hydrographics = { code: 0, distribution: null };
    this.governmentCode = 0;
    this.populationCode = 0;
    this.lawLevelCode = 0;
    this.biomassRating = 0;
    this.axialTilt = null;
  }

}

module.exports = Moon;
