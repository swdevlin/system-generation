const {twoD6} = require("../dice");
const {assignStarport} = require("./assignStarport");
const {assignTechLevel, assignNativeSophontTechLevel} = require("./assignTechLevel");
const assignPopulation = require("../population/assignPopulation");
const {assignTradeCodes} = require("../economics/assignTradeCodes");

const assignSocialCharacteristics = (star, planet) => {
  console.log('assigning social characteristics');
  assignPopulation(star, planet);

  planet.governmentCode = Math.max(twoD6() - 7 + planet.population.code, 0);
  // todo: flesh out government

  planet.lawLevelCode = Math.max(twoD6() - 7 + planet.governmentCode, 0);
  // todo: flesh out law level

  // todo: switch for native vs RAW
  assignNativeSophontTechLevel(star, planet);

  // todo: switch for native vs RAW
  assignStarport(planet);

  assignTradeCodes(planet);
}

module.exports = assignSocialCharacteristics;
