const {twoD6} = require("../dice");
const {assignNativeSophontStarport} = require("./assignStarport");
const TechLevelGenerator = require("../techLevel/TechLevelGenerator");
const assignPopulation = require("../population/assignPopulation");
const {assignTradeCodes} = require("../economics/assignTradeCodes");
const { rollGovernmentCode } = require("../government/rollGovernmentCode");

const assignSocialCharacteristics = (star, planet, {
  maxNativeSophontTechLevel = 15,
  nativeTech = true,
  allowCaptiveGovernment = true,
  governmentTypes,
} = {}) => {
  console.log('  assigning social characteristics');
  assignPopulation(star, planet);

  planet.government.code = rollGovernmentCode(planet.population.code, {
    allowCaptiveGovernment,
    governmentTypes,
  });

  // todo: flesh out government

  planet.lawLevel.code = Math.max(twoD6() - 7 + planet.government.code, 0);
  // todo: flesh out law level

  if (nativeTech) {
    TechLevelGenerator.computeNativeTechLevel(star, planet, { max: maxNativeSophontTechLevel });
  } else {
    TechLevelGenerator.computeTechLevel(planet, { min: 1, max: maxNativeSophontTechLevel });
  }

  assignNativeSophontStarport(planet);

  assignTradeCodes(planet);
}

module.exports = assignSocialCharacteristics;
