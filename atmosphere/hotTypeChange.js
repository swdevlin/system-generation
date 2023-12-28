const {d6} = require("../dice");
const AtmosphereDensities = require("./AtmosphereDensities");
const {insidiousAtmosphere} = require("./insidiousAtmosphere");
const corrosiveAtmosphere = require("./corrosiveAtmosphere");

const hotTypeChange = (star, planet, dm) => {
  const roll = d6() + dm;
  if (roll >= 6)
    insidiousAtmosphere(star, planet);
  else switch (roll) {
    case 1:
      planet.atmosphere.code = 1;
      planet.atmosphere.density = AtmosphereDensities.TRACE;
      break;
    case 3:
    case 4:
    case 5:
      corrosiveAtmosphere(star, planet);
      break;
  }
}

module.exports = hotTypeChange;
