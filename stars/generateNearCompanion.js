const {d6} = require("../dice");
const {ORBIT_TYPES, calculatePeriod} = require("../utils");
const generateStar = require("./generateStar");
const {Random} = require("random-js");

const r = new Random();

const generateNearCompanion = (star) => {
  const companion = generateStar(star, 0, ORBIT_TYPES.NEAR);
  companion.orbit = d6() + 5 + r.integer(0, 9) / 10 - 0.5;
  companion.period = calculatePeriod(companion, star);
  return companion;
}

module.exports = generateNearCompanion;
