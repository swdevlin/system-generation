const { twoD6 } = require('../dice');
const assignPopulation = require('../population/assignPopulation');
const { assignNativeSophontStarport } = require('../terrestrialPlanet/assignStarport');
const { assignNativeSophontTechLevel, assignTechLevel } = require('../terrestrialPlanet/assignTechLevel');
const { assignTradeCodes } = require('../economics/assignTradeCodes');

const assignMoonSocialCharacteristics = (star, moon, {
  maxNativeSophontTechLevel = 15,
  nativeTech = true,
  allowCaptiveGovernment = true,
} = {}) => {
  assignPopulation(star, moon);

  do {
    moon.government.code = Math.max(twoD6() - 7 + moon.population.code, 0);
  } while (moon.government.code === 6 && !allowCaptiveGovernment);

  moon.lawLevel.code = Math.max(twoD6() - 7 + moon.government.code, 0);

  if (nativeTech) {
    assignNativeSophontTechLevel(star, moon, maxNativeSophontTechLevel);
  } else {
    assignTechLevel(moon);
    moon.techLevel.code = Math.min(maxNativeSophontTechLevel, Math.max(1, moon.techLevel.code));
  }

  assignNativeSophontStarport(moon);
  assignTradeCodes(moon);
};

module.exports = assignMoonSocialCharacteristics;
