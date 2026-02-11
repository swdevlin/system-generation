const { twoD6, d6 } = require('../dice');
const AtmosphereDensities = require('./AtmosphereDensities');
const corrosiveAtmosphere = require('./corrosiveAtmosphere');
const unusualAtmosphere = require('./unusualAtmosphere');
const { determineTaint } = require('./taint');
const { insidiousAtmosphere } = require('./insidiousAtmosphere');

// page 95
const cold1 = (star, planet) => {
  const roll = twoD6() - 7 + planet.size;

  if (roll < 1) {
    planet.atmosphere.code = 0;
    planet.atmosphere.density = AtmosphereDensities.NONE;
  } else
    switch (roll) {
      case 1:
      case 2:
        planet.atmosphere.code = 1;
        planet.atmosphere.density = AtmosphereDensities.TRACE;
        break;
      case 3:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
        if (d6() >= 4) planet.atmosphere.irritant = true;
        break;
      case 4:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.THIN;
        planet.atmosphere.irritant = true;
        break;
      case 5:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.THIN;
        break;
      case 6:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.STANDARD;
        break;
      case 7:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.STANDARD;
        planet.atmosphere.irritant = true;
        break;
      case 8:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.DENSE;
        break;
      case 9:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.DENSE;
        planet.atmosphere.irritant = true;
        break;
      case 10:
        planet.atmosphere.code = 10;
        planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
        if (d6() >= 4) {
          planet.atmosphere.irritant = true;
        }
        break;
      case 11:
      case 14:
        corrosiveAtmosphere(star, planet);
        break;
      case 12:
        insidiousAtmosphere(star, planet);
        break;
      case 13:
        planet.atmosphere.code = 13;
        planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
        break;
      case 15:
        unusualAtmosphere(star, planet);
        break;
      case 16:
        planet.atmosphere.code = 16;
        planet.atmosphere.gasType = 'Helium';
        planet.atmosphere.density = AtmosphereDensities.GAS;
        break;
      default:
        planet.atmosphere.code = 17;
        planet.atmosphere.gasType = 'Hydrogen';
        planet.atmosphere.density = AtmosphereDensities.GAS;
        break;
    }
  if (planet.atmosphere.irritant) planet.atmosphere.taint = determineTaint(planet.atmosphere);
};

module.exports = cold1;
