const {twoD6} = require("../dice");
const AtmosphereDensities = require("./AtmosphereDensities");
const {determineTaint} = require('./taint');

const {Random} = require("random-js");
const r = new Random();

const exoticAtmosphere = (star, planet) => {
  let roll = twoD6();
  if (planet.size >= 2 && planet.size <= 4)
    roll -= 2;
  if (planet.orbit < star.hzco-1)
    roll -= 2;
  if (planet.orbit > star.hzco+2)
    roll += 2;

    planet.atmosphere.code = 10;
  // todo: runaway greenhouse check

  if (roll <= 2) {
    planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
    planet.atmosphere.irritant = true;
  } else if (roll >= 14) {
    planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
    planet.atmosphere.irritant = true;
  } else switch(roll) {
    case (3):
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      break;
    case (4):
      planet.atmosphere.density = AtmosphereDensities.THIN;
      planet.atmosphere.irritant = true;
      break;
    case (5):
      planet.atmosphere.density = AtmosphereDensities.THIN;
      break;
    case (6):
      planet.atmosphere.density = AtmosphereDensities.STANDARD;
      break;
    case (7):
      planet.atmosphere.density = AtmosphereDensities.STANDARD;
      planet.atmosphere.irritant = true;
      break;
    case (8):
      planet.atmosphere.density = AtmosphereDensities.DENSE;
      break;
    case (9):
      planet.atmosphere.density = AtmosphereDensities.DENSE;
      planet.atmosphere.irritant = true;
      break;
    case (10):
      planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
      break;
    case (11):
      planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
      planet.atmosphere.irritant = true;
      break;
    case (12):
      planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
      planet.atmosphere.irritant = true;
      break;
    case (13):
      planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
      break;
    default:
      planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
      planet.atmosphere.irritant = true;
      break;
  }

  // page 86
  // todo: determine gases

  if (planet.atmosphere.irritant)
    planet.atmosphere.taint = determineTaint(planet.atmosphere);

}

module.exports = exoticAtmosphere;
