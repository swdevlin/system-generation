const { twoD6 } = require('../dice');
const AtmosphereDensities = require('./AtmosphereDensities');
const { determineTaint } = require('./taint');

const corrosiveAtmosphere = (star, planet) => {
  let roll = twoD6();
  if (planet.size >= 2 && planet.size <= 4) roll -= 3;
  if (planet.effectiveHZCODeviation < -1) roll += 4;
  if (planet.effectiveHZCODeviation > 2) roll -= 2;

  planet.atmosphere.code = 11;
  // todo: runaway greenhouse check

  if (roll <= 1) {
    // todo: set temperature
    planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
    planet.atmosphere.irritant = true;
  } else
    switch (roll) {
      case 2:
        planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
        planet.atmosphere.irritant = true;
        break;
      case 3:
        planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
        break;
      case 4:
        planet.atmosphere.density = AtmosphereDensities.THIN;
        planet.atmosphere.irritant = true;
        break;
      case 5:
        planet.atmosphere.density = AtmosphereDensities.THIN;
        break;
      case 6:
        planet.atmosphere.density = AtmosphereDensities.STANDARD;
        break;
      case 7:
        planet.atmosphere.density = AtmosphereDensities.STANDARD;
        planet.atmosphere.irritant = true;
        break;
      case 8:
        planet.atmosphere.density = AtmosphereDensities.DENSE;
        break;
      case 9:
        planet.atmosphere.density = AtmosphereDensities.DENSE;
        planet.atmosphere.irritant = true;
        break;
      case 10:
        planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
        break;
      case 11:
        planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
        planet.atmosphere.irritant = true;
        break;
      case 12:
        planet.atmosphere.density = AtmosphereDensities.EXTREMELY_DENSE;
        break;
      case 13:
        planet.atmosphere.density = AtmosphereDensities.EXTREMELY_DENSE;
        // todo: set temperature
        break;
      default:
        planet.atmosphere.density = AtmosphereDensities.EXTREMELY_DENSE;
        planet.atmosphere.irritant = true;
        // todo: set temperature
        break;
    }

  // page 86
  // todo: determine gases

  if (planet.atmosphere.irritant) planet.atmosphere.taint = determineTaint(planet.atmosphere);
};

module.exports = corrosiveAtmosphere;
