const {ORBIT_TYPES, companionOrbit, calculatePeriod} = require("../utils");
const {multiStarClassification} = require("./determineStarClassification");
const Star = require("./star");

const addCompanion = ({star, unusualChance}) => {
  const classification = multiStarClassification({
    unusualChance: unusualChance,
    primary: star,
    orbitType: ORBIT_TYPES.COMPANION
  });
  if (!classification.stellarType) {
    console.log(JSON.stringify(star, null, 2));
    console.log(star.stellarType);
    console.log(JSON.stringify(classification, null, 2));
  }
  const companion = new Star(classification, ORBIT_TYPES.COMPANION);
  star.companion = companion;
  companion.orbit = companionOrbit();
  companion.period = calculatePeriod(companion, star);
}

module.exports = addCompanion;
