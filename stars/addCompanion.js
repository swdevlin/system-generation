const {ORBIT_TYPES, companionOrbit, calculatePeriod} = require("../utils");
const {multiStarClassification, LAST_TYPE} = require("./determineStarClassification");
const Star = require("./star");
const {DICE_LOG} = require("../dice");

const addCompanion = ({star, unusualChance}) => {
  const classification = multiStarClassification({
    unusualChance: unusualChance,
    primary: star,
    orbitType: ORBIT_TYPES.COMPANION
  });
  // if (!classification.stellarType) {
  //   console.log('NO CLASSIFICATION');
  //   console.log(JSON.stringify(classification, null, 2));
  //   console.log(LAST_TYPE);
  //   console.log(DICE_LOG);
  //   console.log(JSON.stringify(star, null, 2));
  //   console.log(star.stellarType);
  // }
  const companion = new Star(classification, ORBIT_TYPES.COMPANION);
  star.companion = companion;
  companion.orbit = companionOrbit();
  companion.period = calculatePeriod(companion, star);
}

module.exports = addCompanion;
