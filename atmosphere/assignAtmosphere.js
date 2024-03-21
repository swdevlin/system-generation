const hot2 = require("./hot2");
const hot1 = require("./hot1");
const cold3 = require("./cold3");
const cold1 = require("./cold1");
const hzAtmosphere = require("./hzAtmosphere");

const AtmosphereDensities = require("./AtmosphereDensities");

const {Random} = require("random-js");
const r = new Random();

// Page 78
assignAtmosphere = (star, planet) => {
  if (planet.atmosphere.code === null)
    if (planet.size === 'R' || planet.size === 'S' || planet.size < 2) {
      planet.atmosphere.code = 0;
    } else {
      if (planet.effectiveHZCODeviation < -2)
        hot2(star, planet);
      else if (planet.effectiveHZCODeviation < -1)
        hot1(star, planet);
      else if (planet.effectiveHZCODeviation > 2)
        cold3(star, planet);
      else if (planet.effectiveHZCODeviation > 1)
        cold1(star, planet);
      else
        hzAtmosphere(star, planet);
    }

  switch (planet.atmosphere.density) {
    case AtmosphereDensities.NONE:
      planet.atmosphere.bar = 0;
      break;
    case AtmosphereDensities.TRACE:
      planet.atmosphere.bar = r.real(0.001, 0.09, true);
      break;
    case AtmosphereDensities.VERY_THIN:
      planet.atmosphere.bar = r.real(0.1, 0.42, true);
      break;
    case AtmosphereDensities.THIN:
      planet.atmosphere.bar = r.real(0.43, 0.7, true);
      break;
    case AtmosphereDensities.STANDARD:
      planet.atmosphere.bar = r.real(0.7, 1.49, true);
      break;
    case AtmosphereDensities.DENSE:
      planet.atmosphere.bar = r.real(1.5, 2.49, true);
      break;
    case AtmosphereDensities.VERY_DENSE:
      planet.atmosphere.bar = r.real(2.5, 10, true);
      break;
    case AtmosphereDensities.LOW:
      planet.atmosphere.bar = r.real(0.1, 0.42, true);
      break;
    case AtmosphereDensities.EXTREMELY_DENSE:
      planet.atmosphere.bar = 10;
      break;
    case AtmosphereDensities.GAS:
      if (planet.atmosphere.gasType === 'Helium')
        planet.atmosphere.bar = 100;
      else
        planet.atmosphere.bar = 1000;
      break;
    default:
      planet.atmosphere.bar = 0;
  }

}

module.exports = assignAtmosphere;
