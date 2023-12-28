const {twoD6, d6} = require("../dice");
const AtmosphereDensities = require("./AtmosphereDensities");
const {determineTaint} = require("./taint");

// page 95
const cold3 = (star, planet) => {
  const roll = twoD6() - 7 + planet.size;

  if (roll < 1) {
    planet.atmosphere.code = 0;
    planet.atmosphere.density = AtmosphereDensities.NONE;
  } else switch (roll) {
    case 1:
    case 2:
      planet.atmosphere.code = 1;
      planet.atmosphere.density = AtmosphereDensities.TRACE;
      break;
    case 3:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      if (d6() >= 4) {
        planet.atmosphere.irritant = true;
      }
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
      planet.atmosphere.code = 11;
      break;
    case 12:
      planet.atmosphere.code = 12;
      break;
    case 13:
      planet.atmosphere.code = 16;
      planet.atmosphere.density = AtmosphereDensities.GAS;
      planet.atmosphere.gasType = 'Helium';
      break;
    case 14:
    case 16:
    case 17:
    default:
      planet.atmosphere.code = 17;
      planet.atmosphere.density = AtmosphereDensities.GAS;
      planet.atmosphere.gasType = 'Hydrogen';
      break;
    case 15:
      planet.atmosphere.code = 15;
      break;
  }

  if (planet.atmosphere.irritant)
    planet.atmosphere.taint = determineTaint(planet.atmosphere);
}

module.exports = cold3;
