const {d6} = require("../dice");
const {ORBIT_TYPES, calculatePeriod} = require("../utils");
const {Random} = require("random-js");
const {multiStarClassification} = require("./determineStarClassification");
const Star = require("./star");

const r = new Random();

const generateFarSecondary = ({star, unusualChance, classification}) => {
  if (!classification)
    classification = multiStarClassification({
      unusualChance: unusualChance,
      primary: star,
      orbitType: ORBIT_TYPES.FAR
    });

  const secondary = new Star(classification, ORBIT_TYPES.FAR);
  secondary.orbit = d6() + 11 + r.integer(0, 9) / 10 - 0.5;
  secondary.period = calculatePeriod(secondary, star);

  return secondary;
}

module.exports = generateFarSecondary;
