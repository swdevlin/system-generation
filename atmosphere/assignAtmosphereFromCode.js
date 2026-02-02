const AtmosphereDensities = require("./AtmosphereDensities");
const {determineTaint} = require('./taint');
const exoticAtmosphere = require("./exoticAtmosphere");
const corrosiveAtmosphere = require("./corrosiveAtmosphere");
const {insidiousAtmosphere} = require("./insidiousAtmosphere");
const unusualAtmosphere = require("./unusualAtmosphere");

// Sets density and other properties based on an existing atmosphere code
const assignAtmosphereFromCode = (star, planet) => {
  const code = planet.atmosphere.code;

  switch (code) {
    case 0:
      planet.atmosphere.density = AtmosphereDensities.NONE;
      break;
    case 1:
      planet.atmosphere.density = AtmosphereDensities.TRACE;
      break;
    case 2:
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      planet.atmosphere.taint = determineTaint(planet.atmosphere);
      break;
    case 3:
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      break;
    case 4:
      planet.atmosphere.density = AtmosphereDensities.THIN;
      planet.atmosphere.taint = determineTaint(planet.atmosphere);
      break;
    case 5:
      planet.atmosphere.density = AtmosphereDensities.THIN;
      break;
    case 6:
      planet.atmosphere.density = AtmosphereDensities.STANDARD;
      break;
    case 7:
      planet.atmosphere.density = AtmosphereDensities.STANDARD;
      planet.atmosphere.taint = determineTaint(planet.atmosphere);
      break;
    case 8:
      planet.atmosphere.density = AtmosphereDensities.DENSE;
      break;
    case 9:
      planet.atmosphere.density = AtmosphereDensities.DENSE;
      planet.atmosphere.taint = determineTaint(planet.atmosphere);
      break;
    case 10:
      // Exotic - density varies, call existing function then restore code
      exoticAtmosphere(star, planet);
      planet.atmosphere.code = code;
      break;
    case 11:
      // Corrosive - density varies
      corrosiveAtmosphere(star, planet);
      planet.atmosphere.code = code;
      break;
    case 12:
      // Insidious - density varies
      insidiousAtmosphere(star, planet);
      planet.atmosphere.code = code;
      break;
    case 13:
      planet.atmosphere.density = AtmosphereDensities.DENSE;
      break;
    case 14:
      planet.atmosphere.density = AtmosphereDensities.LOW;
      break;
    case 15:
      // Unusual - properties vary
      unusualAtmosphere(star, planet);
      planet.atmosphere.code = code;
      break;
    case 16:
      planet.atmosphere.density = AtmosphereDensities.GAS;
      planet.atmosphere.gasType = 'Helium';
      break;
    default:
      planet.atmosphere.density = AtmosphereDensities.GAS;
      planet.atmosphere.gasType = 'Hydrogen';
      break;
  }
}

module.exports = assignAtmosphereFromCode;
