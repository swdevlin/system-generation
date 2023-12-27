const {twoD6, d6} = require("../dice");
const Atmosphere = require("./Atmosphere");
const typeChange = require("./hotTypeChange");
const AtmosphereDensities = require("./AtmosphereDensities");

const hotTypeChange = require("./hotTypeChange");
const corrosiveAtmosphere = require("./corrosiveAtmosphere");
const {insidiousAtmosphere} = require("./insidiousAtmosphere");
const unusualAtmosphere = require("./unusualAtmosphere");
const {determineTaint} = require("./taint");

// page 94
const hot2 = (star, planet) => {
  if (planet.size === 'S') {
    planet.atmosphere.code = 0;
    planet.atmosphere.density = AtmosphereDensities.NONE;
    return;
  }

  const roll = twoD6() - 7 + planet.size;

  if (roll < 2) {
    planet.atmosphere.code = 0;
    planet.atmosphere.density = AtmosphereDensities.NONE;
    return;
  }

  switch (roll) {
    case 2:
    case 3:
      planet.atmosphere.code = 1;
      planet.atmosphere.density = AtmosphereDensities.TRACE;
      break;
    case 4:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.VERY_THIN;
      if (d6() >= 4)
        planet.atmosphere.irritant = true;
      hotTypeChange(planet.atmosphere, 0);
      break;
    case 5:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.THIN;
      if (d6() >= 4)
        planet.atmosphere.irritant = true;
      hotTypeChange(planet.atmosphere, 0);
      break;
    case 6:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.STANDARD;
      if (d6() >= 4)
        planet.atmosphere.irritant = true;
      hotTypeChange(planet.atmosphere, 0);
      break;
    case 7:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.DENSE;
      if (d6() >= 4)
        planet.atmosphere.irritant = true;
      hotTypeChange(planet.atmosphere, 1);
      break;
    case 8:
      planet.atmosphere.code = 10;
      planet.atmosphere.density = AtmosphereDensities.VERY_DENSE;
      if (d6() >= 4)
        planet.atmosphere.irritant = true;
      hotTypeChange(planet.atmosphere, 1);
      break;
    case 9:
    case 10:
    case 11:
    case 13:
      corrosiveAtmosphere(star, planet);
      break;
    case 12:
    case 14:
      insidiousAtmosphere(star, planet);
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

  if (planet.atmosphere.irritant)
    planet.atmosphere.taint = determineTaint(planet.atmosphere);
}

module.exports = hot2;
