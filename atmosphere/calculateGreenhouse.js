const {d6, threeD6} = require("../dice");

const calculateGreenhouse = (planet) => {
  if (planet.atmosphere.code === 0)
    return 0;
  let ghFactor = 0.5 * Math.sqrt(planet.atmosphere.bar);
  switch (planet.atmosphere.code) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 13:
    case 14:
      ghFactor += threeD6() * 0.01;
      break;
    case 10:
    case 15:
      ghFactor *= Math.max(0.5, d6() -1);
      break;
    case 11:
    case 12:
    case 16:
    case 17:
      const roll= d6();
      if (roll === 6)
        ghFactor *= threeD6();
      else
        ghFactor *= roll;
      break;
  }

  return ghFactor;
}


module.exports = calculateGreenhouse;
