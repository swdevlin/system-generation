const {twoD6} = require("../dice");
const Atmosphere = require("./Atmosphere");

const AtmosphereDensities = require("./AtmosphereDensities");

const {Random} = require("random-js");
const r = new Random();

const unusualAtmosphere = (star, planet) => {
  planet.atmosphere.code = 15;
  planet.atmosphere.density = AtmosphereDensities.NONE;
}

module.exports = unusualAtmosphere;
