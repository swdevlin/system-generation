const {d6, d3} = require("../dice");

// Book 3, pg 8
const systemDensity = (density) => {
  let bodies = 0;

  if (density >= 1 && density <= 3) {
    bodies = 1;
  } else if (density >= 4 && density <= 6) {
    bodies = d3();
  } else if (density >= 7 && density <= 9) {
    bodies = d6() + 1;
  } else if (density >= 10 && density <= 12) {
    bodies = d6() + d6();
  } else if (density >= 13 && density <= 15) {
    bodies = d6() + d6() + 3;
  } else if (density >= 16 && density <= 18) {
    bodies = d6() + d6() + d6();
  } else if (density >= 19 && density <= 21) {
    bodies = d6() + d6() + d6() + d6();
  } else {
    bodies = d6() + d6() + d6() + d6() + 2 + systemDensity(density - 22);
  }

  return bodies;
};

module.exports = systemDensity;
