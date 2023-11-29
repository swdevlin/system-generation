const {ORBIT_TYPES, calculatePeriod} = require("../utils");
const {d6} = require("../dice");
const {Random} = require("random-js");
const {multiStarClassification} = require("./determineStarClassification");
const Star = require("./star");

const r = new Random();

const generateCloseSecondary = ({star, unusualChance, classification}) => {
  if (!classification)
    classification = multiStarClassification({
      unusualChance: unusualChance,
      primary: star,
      orbitType: ORBIT_TYPES.CLOSE
    });

  const secondary = new Star(classification, ORBIT_TYPES.CLOSE);

  secondary.orbit = d6() - 1;
  if (secondary.orbit === 0)
    secondary.orbit = 0.5;
  else
    secondary.orbit += r.integer(0, 9) / 10 - 0.5;

  secondary.period = calculatePeriod(secondary, star);

  return secondary;
}

module.exports = generateCloseSecondary;
