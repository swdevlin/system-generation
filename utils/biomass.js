const {twoD6} = require("../dice");

// page 127
const biomass = (star, planet) => {
  let b = twoD6();
  switch (planet.atmosphere.code) {
    case 0: b -= 6; break;
    case 1: b -= 4; break;
    case 2: b -= 3; break;
    case 3: b -= 3; break;
    case 4: b -= 2; break;
    case 5: b -= 2; break;
    case 6:
    case 7:
      break;
    case 8: b += 2; break;
    case 9: b += 2; break;
    case 10: b -= 3; break;
    case 11: b -= 5; break;
    case 12: b -= 7; break;
    case 13: b += 2; break;
    case 14: b -= 3; break;
    default:
      b -= 5;
      break;
  }

  switch (planet.hydrographics.code) {
    case 0: b -= 4; break;
    case 1:
    case 2:
    case 3:
      b -= 2;
      break;
    case 4:
    case 5:
      break;
    case 6:
    case 7:
    case 8:
      b += 1;
      break;
    default:
      b += 2;
      break;
  }

  if (planet.meanTemperature > 353)
    b -= 4;
  else if (planet.meanTemperature < 273)
    b -= 2;
  else if (planet.meanTemperature >= 279 && planet.meanTemperature <= 303)
    b += 2;

  if (b === 0 && planet.atmosphere.irritant === 'biological')
    b = 1;
  else if (b === 0 && planet.atmosphere.taint)
    b = 1;
  if (b > 0 && ([0,1,10,11,12,15].includes(planet.atmosphere.code) || planet.atmosphere.code > 15))
    switch (planet.atmosphere.code) {
      case 0: b += 5; break;
      case 1: b += 3; break;
      case 10: b += 2; break;
      case 11: b += 4; break;
      case 12: b += 6; break;
      default: b += 4; break;
    }

  return Math.min(Math.max(b, -12), 4);
}

module.exports = biomass;
