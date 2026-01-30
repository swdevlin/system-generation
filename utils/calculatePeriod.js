const {orbitToAU} = require("./index");
const calculatePeriod = (star, primary) => {
  let d = orbitToAU(star.orbit);
  return 365.25 * Math.sqrt(d**3/(star.mass + primary.mass));
}

module.exports = calculatePeriod;
