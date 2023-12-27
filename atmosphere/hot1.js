const {twoD6, d6} = require("../dice");
const AtmosphereDensities = require("./AtmosphereDensities");
const {determineTaint} = require('./taint');

// page 94
const hot1 = (star, planet) => {
  const roll = twoD6() - 7 + planet.size;
  if (roll < 1) {
    planet.atmosphere.code = 0;
    planet.atmosphere.density = AtmosphereDensities.NONE;
  } else switch (roll) {
    case 1:
      planet.atmosphere.code = 1;
      planet.atmosphere.density = AtmosphereDensities.TRACE;
      break;
    case 2:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      planet.atmosphere.irritant = true;
      break;
    case 3:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
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
    case 13:
      planet.atmosphere.code = 11;
      break;
    case 12:
    case 14:
      planet.atmosphere.code = 12;
      break;
    case 15:
      planet.atmosphere.code = 15;
      break;
    case 16:
      planet.atmosphere.code = 16;
      break;
    default:
      planet.atmosphere.code = 17;
      break;
  }
  if (planet.atmosphere.irritant)
    planet.atmosphere.taint = determineTaint(planet.atmosphere);
}

module.exports = hot1;
