const {ORBIT_TYPES, companionOrbit, calculatePeriod} = require("../utils");
const generateStar = require("./generateStar");

const addCompanion = (star) => {
  star.companion = generateStar(star, 0, ORBIT_TYPES.COMPANION);
  star.companion.orbit = companionOrbit();
  star.companion.period = calculatePeriod(star.companion, star);
}

module.exports = addCompanion;
