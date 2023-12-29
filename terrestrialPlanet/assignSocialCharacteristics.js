const {d3, twoD6} = require("../dice");
const {assignStarport} = require("./assignStarport");
const {assignTechLevel} = require("./assignTechLevel");

const assignSocialCharacteristics = (star, planet) => {
  console.log('assigning social characteristics');
  planet.populationCode = d3() + d3() + 4;
  planet.governmentCode = twoD6() - 7 + planet.populationCode;
  // todo: flesh out government
  planet.lawLevelCode = twoD6() - 7 + planet.governmentCode;
  // todo: flesh out law level
  assignTechLevel(planet);
  // todo: assign starport
  assignStarport(planet);
}

module.exports = assignSocialCharacteristics;
