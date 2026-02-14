const { twoD6 } = require('../dice');

const AtmosphereDensities = require('./AtmosphereDensities');
const unusualAtmosphere = require('./unusualAtmosphere');
const { determineTaint } = require('./taint');
const { ExoticAtmosphereGenerator } = require('../utils/ExoticAtmosphereGenerator');
const { CorrosiveAtmosphereGenerator } = require('../utils/CorrosiveAtmosphereGenerator');
const { InsidiousAtmosphereGenerator } = require('../utils/InsidiousAtmosphereGenerator');

// page 79
const hzAtmosphere = (star, planet) => {
  if (planet.size <= 2 || planet.size === 'S') {
    planet.atmosphere.density = AtmosphereDensities.None;
    planet.atmosphere.code = 0;
    return;
  }

  const roll = twoD6() - 7 + planet.size;
  if (roll < 0) {
    planet.atmosphere.density = AtmosphereDensities.None;
    planet.atmosphere.code = 0;
  } else
    switch (roll) {
      case 0:
        planet.atmosphere.code = 0;
        planet.atmosphere.density = AtmosphereDensities.NONE;
        break;
      case 1:
        planet.atmosphere.code = 1;
        planet.atmosphere.density = AtmosphereDensities.TRACE;
        break;
      case 2:
        planet.atmosphere.code = 2;
        planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
        planet.atmosphere.taint = determineTaint(planet.atmosphere);
        break;
      case 3:
        planet.atmosphere.code = 3;
        planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
        break;
      case 4:
        planet.atmosphere.code = 4;
        planet.atmosphere.density = AtmosphereDensities.THIN;
        planet.atmosphere.taint = determineTaint(planet.atmosphere);
        break;
      case 5:
        planet.atmosphere.code = 5;
        planet.atmosphere.density = AtmosphereDensities.THIN;
        break;
      case 6:
        planet.atmosphere.code = 6;
        planet.atmosphere.density = AtmosphereDensities.STANDARD;
        break;
      case 7:
        planet.atmosphere.code = 7;
        planet.atmosphere.density = AtmosphereDensities.STANDARD;
        planet.atmosphere.taint = determineTaint(planet.atmosphere);
        break;
      case 8:
        planet.atmosphere.code = 8;
        planet.atmosphere.density = AtmosphereDensities.DENSE;
        break;
      case 9:
        planet.atmosphere.code = 9;
        planet.atmosphere.density = AtmosphereDensities.DENSE;
        planet.atmosphere.taint = determineTaint(planet.atmosphere);
        break;
      case 10:
        new ExoticAtmosphereGenerator().assignAtmosphere(star, planet);
        break;
      case 11:
        new CorrosiveAtmosphereGenerator().assignAtmosphere(star, planet);
        break;
      case 12:
        new InsidiousAtmosphereGenerator().assignAtmosphere(star, planet);
        break;
      case 13:
        planet.atmosphere.code = 13;
        planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
        break;
      case 14:
        planet.atmosphere.code = 14;
        planet.atmosphere.density = AtmosphereDensities.LOW;
        break;
      case 15:
        unusualAtmosphere(star, planet);
        break;
      case 16:
        planet.atmosphere.code = 16;
        planet.atmosphere.density = AtmosphereDensities.GAS;
        planet.gasType = 'Helium';
        break;
      default:
        planet.atmosphere.code = 17;
        planet.atmosphere.density = AtmosphereDensities.GAS;
        planet.gasType = 'Hydrogen';
        break;
    }
};

module.exports = hzAtmosphere;
