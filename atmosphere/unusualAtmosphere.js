const UnusualAtmosphereGenerator = require('./UnusualAtmosphereGenerator');

const unusualAtmosphere = (star, planet) => {
  new UnusualAtmosphereGenerator().generate(star, planet);
};

module.exports = unusualAtmosphere;