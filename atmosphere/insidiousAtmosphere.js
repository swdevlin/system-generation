const {twoD6} = require("../dice");

const AtmosphereDensities = require("./AtmosphereDensities");
const corrosiveAtmosphere = require("./corrosiveAtmosphere");

const insidiousHazard = (planet) => {
  let roll = twoD6();
  if (planet.atmosphere.density === AtmosphereDensities.EXTREMELY_DENSE)
    roll += 2;

  switch (roll) {
    case 2:
    case 3:
    case 4:
      planet.atmosphere.hazardCode = 'B';
      break;
    case 5:
      planet.atmosphere.hazardCode = 'R';
      break;
    case 6:
      planet.atmosphere.hazardCode = 'G';
      break;
    case 7:
      planet.atmosphere.hazardCode = 'G';
      break;
    case 8:
      planet.atmosphere.hazardCode = 'T';
      break;
    case 9:
      planet.atmosphere.hazardCode = 'G';
      break;
    case 10:
      planet.atmosphere.hazardCode = 'T';
      break;
    case 11:
      planet.atmosphere.hazardCode = 'R';
      break;
    default:
      planet.atmosphere.hazardCode = 'T';
      break;
  }
}

const insidiousAtmosphere = (star, planet) => {
  corrosiveAtmosphere(star, planet);
  insidiousHazard(planet);
}

module.exports = {
  insidiousAtmosphere: insidiousAtmosphere,
  insidiousHazard: insidiousHazard
};
