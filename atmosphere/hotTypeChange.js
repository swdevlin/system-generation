const {d6} = require("../dice");
const AtmosphereDensities = require("./AtmosphereDensities");
const { CorrosiveAtmosphereGenerator } = require('../utils/CorrosiveAtmosphereGenerator');
const { InsidiousAtmosphereGenerator } = require('../utils/InsidiousAtmosphereGenerator');

const hotTypeChange = (star, planet, dm) => {
  const roll = d6() + dm;
  if (roll >= 6)
    new InsidiousAtmosphereGenerator().assignAtmosphere(star, planet);
  else switch (roll) {
    case 1:
      planet.atmosphere.code = 1;
      planet.atmosphere.density = AtmosphereDensities.TRACE;
      break;
    case 3:
    case 4:
    case 5:
      new CorrosiveAtmosphereGenerator().assignAtmosphere(star, planet);
      break;
  }
}

module.exports = hotTypeChange;
