const {ORBIT_TYPES, calculatePeriod} = require("../utils");
const {d6} = require("../dice");
const generateStar = require("./generateStar");
const {Random} = require("random-js");

const r = new Random();

const generateCloseCompanion = (star) => {
  const companion = generateStar(star, 0, ORBIT_TYPES.CLOSE);
  companion.orbit = d6() - 1;
  if (companion.orbit === 0)
    companion.orbit = 0.5;
  else
    companion.orbit += r.integer(0, 9) / 10 - 0.5;
  companion.period = calculatePeriod(companion, star);
  return companion;
}

module.exports = generateCloseCompanion;
