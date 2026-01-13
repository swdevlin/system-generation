const {ORBIT_TYPES, companionOrbit, calculatePeriod} = require("../utils");
const {multiStarClassification, LAST_TYPE} = require("./determineStarClassification");
const Star = require("./star");
const {DICE_LOG} = require("../dice");
const starFromDefinition = require("./starFromDefinition");

const addCompanion = ({star, unusualChance, definition}) => {
  let companion;
  if (definition) {
    companion = starFromDefinition(definition, ORBIT_TYPES.COMPANION, unusualChance);
  } else {
    const classification = multiStarClassification({
      unusualChance: unusualChance,
      primary: star,
      orbitType: ORBIT_TYPES.COMPANION
    });
    companion = new Star(classification, ORBIT_TYPES.COMPANION);
  }
  star.companion = companion;
  companion.orbit = companionOrbit();
  companion.period = calculatePeriod(companion, star);
}

module.exports = addCompanion;
