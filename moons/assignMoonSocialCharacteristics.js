const { twoD6 } = require('../dice');
const assignPopulation = require('../population/assignPopulation');
const { assignNativeSophontStarport } = require('../terrestrialPlanet/assignStarport');
const { assignNativeSophontTechLevel, assignTechLevel } = require('../terrestrialPlanet/assignTechLevel');
const { assignTradeCodes } = require('../economics/assignTradeCodes');
const { rollGovernmentCode } = require('../government/rollGovernmentCode');

const assignMoonSocialCharacteristics = (star, moon, {
  maxNativeSophontTechLevel = 15,
  nativeTech = true,
  allowCaptiveGovernment = true,
  governmentTypes,
} = {}) => {
  assignPopulation(star, moon);

  moon.government.code = rollGovernmentCode(moon.population.code, {
    allowCaptiveGovernment,
    governmentTypes,
  });

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
