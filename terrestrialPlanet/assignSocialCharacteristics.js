const {twoD6} = require("../dice");
const {assignNativeSophontStarport} = require("./assignStarport");
const {assignNativeSophontTechLevel, assignTechLevel} = require("./assignTechLevel");
const assignPopulation = require("../population/assignPopulation");
const {assignTradeCodes} = require("../economics/assignTradeCodes");
const {getBoolFromEnv} = require("../utils");

const assignSocialCharacteristics = (star, planet, maxNativeSophontTechLevel = 15, nativeTech = true) => {
  console.log('  assigning social characteristics');
  assignPopulation(star, planet);

  do {
    planet.governmentCode = Math.max(twoD6() - 7 + planet.population.code, 0);
  } while (planet.governmentCode === 6 && getBoolFromEnv('noCaptiveGovernment'));

  // todo: flesh out government

  planet.lawLevelCode = Math.max(twoD6() - 7 + planet.governmentCode, 0);
  // todo: flesh out law level

  if (nativeTech) {
    assignNativeSophontTechLevel(star, planet, maxNativeSophontTechLevel);
  } else {
    assignTechLevel(planet);
    planet.techLevel = Math.min(maxNativeSophontTechLevel, Math.max(1, planet.techLevel));
  }

  assignNativeSophontStarport(planet);

  assignTradeCodes(planet);
}

module.exports = assignSocialCharacteristics;
