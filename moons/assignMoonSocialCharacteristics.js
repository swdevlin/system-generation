const { twoD6 } = require('../dice');
const assignPopulation = require('../population/assignPopulation');
const { assignNativeSophontStarport } = require('../terrestrialPlanet/assignStarport');
const TechLevelGenerator = require('../techLevel/TechLevelGenerator');
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
    TechLevelGenerator.computeNativeTechLevel(star, moon, { max: maxNativeSophontTechLevel });
  } else {
    TechLevelGenerator.computeTechLevel(moon, { min: 1, max: maxNativeSophontTechLevel });
  }

  assignNativeSophontStarport(moon);
  assignTradeCodes(moon);
};

module.exports = assignMoonSocialCharacteristics;
