const {d6} = require("../dice");
const {ORBIT_TYPES, calculatePeriod} = require("../utils");
const {Random} = require("random-js");
const {multiStarClassification} = require("./determineStarClassification");
const Star = require("./star");

const r = new Random();

const generateNearSecondary = ({star, unusualChance, classification}) => {
  if (!classification)
    classification = multiStarClassification({
      unusualChance: unusualChance,
      primary: star,
      orbitType: ORBIT_TYPES.NEAR
    });

  const secondary = new Star(classification, ORBIT_TYPES.NEAR);

  secondary.orbit = d6() + 5 + r.integer(0, 9) / 10 - 0.5;
  secondary.period = calculatePeriod(secondary, star);

  return secondary;
}

module.exports = generateNearSecondary;
