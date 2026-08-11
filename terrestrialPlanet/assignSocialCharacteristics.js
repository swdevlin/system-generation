const {twoD6} = require("../dice");
const {assignNativeSophontStarport} = require("./assignStarport");
const {assignNativeSophontTechLevel, assignTechLevel} = require("./assignTechLevel");
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
    assignNativeSophontTechLevel(star, planet, maxNativeSophontTechLevel);
  } else {
    assignTechLevel(planet);
    planet.techLevel.code = Math.min(maxNativeSophontTechLevel, Math.max(1, planet.techLevel.code));
  }

  assignNativeSophontStarport(planet);

  assignTradeCodes(planet);
}

module.exports = assignSocialCharacteristics;
