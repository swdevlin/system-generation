const {twoD6} = require("../dice");

// page 127
const biomass = (star, planet) => {
  let roll = twoD6();
  let dm = 0
  switch (planet.atmosphere.code) {
    case 0:
      dm -= 6; break;
    case 1:
      dm -= 4; break;
    case 2:
    case 3:
    case 14:
      dm -= 3; break;
    case 4:
    case 5:
      dm -= 2; break;
    case 6:
    case 7:
      break;
    case 8:
    case 9:
    case 13:
      dm += 2; break;
    case 10:
      dm -= 3; break;
    case 11:
      dm -= 5; break;
    case 12:
      dm -= 7; break;
    default:
      dm -= 5;
      break;
  }

  switch (planet.hydrographics.code) {
    case 0:
      dm -= 4; break;
    case 1:
    case 2:
    case 3:
      dm -= 2;
      break;
    case 4:
    case 5:
      break;
    case 6:
    case 7:
    case 8:
      dm += 1;
      break;
    default:
      dm += 2;
      break;
  }

  if (planet.meanTemperature > 353)
    dm -= 4;
  else if (planet.meanTemperature < 273)
    dm -= 2;
  else if (planet.meanTemperature >= 279 && planet.meanTemperature <= 303)
    dm += 2;

  if (dm === 0 && planet.atmosphere.irritant === 'biological')
    dm = 1;
  else if (dm === 0 && planet.atmosphere.taint)
    dm = 1;
  if (dm > 0 && ([0,1,10,11,12,15].includes(planet.atmosphere.code) || planet.atmosphere.code > 15))
    switch (planet.atmosphere.code) {
      case 0: dm += 5; break;
      case 1: dm += 3; break;
      case 10: dm += 2; break;
      case 11: dm += 4; break;
      case 12: dm += 6; break;
      default: dm += 4; break;
    }

  if (star.age < 0.2)
    dm -= 6;
  else if (star.age < 1)
    dm -= 2;
  else if (star.age > 4)
    dm += 1;

  return roll + Math.min(Math.max(dm, -12), 4);
}

module.exports = biomass;
