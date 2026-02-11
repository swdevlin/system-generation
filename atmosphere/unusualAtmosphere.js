const AtmosphereDensities = require('./AtmosphereDensities');

const unusualAtmosphere = (star, planet) => {
  planet.atmosphere.code = 15;
  planet.atmosphere.density = AtmosphereDensities.NONE;
};

module.exports = unusualAtmosphere;
