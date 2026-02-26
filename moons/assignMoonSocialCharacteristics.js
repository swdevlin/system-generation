const { twoD6 } = require('../dice');
const { getBoolFromEnv } = require('../utils');
const assignPopulation = require('../population/assignPopulation');
const { assignNativeSophontStarport } = require('../terrestrialPlanet/assignStarport');
const { assignNativeSophontTechLevel } = require('../terrestrialPlanet/assignTechLevel');
const { assignTradeCodes } = require('../economics/assignTradeCodes');

const assignMoonSocialCharacteristics = (star, moon) => {
  assignPopulation(star, moon);

  do {
    moon.governmentCode = Math.max(twoD6() - 7 + moon.population.code, 0);
  } while (moon.governmentCode === 6 && getBoolFromEnv('noCaptiveGovernment'));

  moon.lawLevelCode = Math.max(twoD6() - 7 + moon.governmentCode, 0);

  assignNativeSophontTechLevel(star, moon);
  assignNativeSophontStarport(moon);
  assignTradeCodes(moon);
};

module.exports = assignMoonSocialCharacteristics;
