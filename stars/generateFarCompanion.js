const {d6} = require("../dice");
const {ORBIT_TYPES, calculatePeriod} = require("../utils");
const generateStar = require("./generateStar");
const {Random} = require("random-js");

const r = new Random();

const generateFarCompanion = (star) => {
  const companion = generateStar(star, 0, ORBIT_TYPES.FAR);
  companion.orbit = d6() + 11 + r.integer(0, 9) / 10 - 0.5;
  companion.period = calculatePeriod(companion, star);
  return companion;

}

module.exports = generateFarCompanion;
