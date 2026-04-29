const {twoD6} = require("../dice");
const {assignNativeSophontStarport} = require("./assignStarport");
const {assignNativeSophontTechLevel, assignTechLevel} = require("./assignTechLevel");
const assignPopulation = require("../population/assignPopulation");
const {assignTradeCodes} = require("../economics/assignTradeCodes");

const assignSocialCharacteristics = (star, planet, {
  maxNativeSophontTechLevel = 15,
  nativeTech = true,
  allowCaptiveGovernment = true,
} = {}) => {
  console.log('  assigning social characteristics');
  assignPopulation(star, planet);

  do {
    planet.government.code = Math.max(twoD6() - 7 + planet.population.code, 0);
  } while (planet.government.code === 6 && !allowCaptiveGovernment);

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
