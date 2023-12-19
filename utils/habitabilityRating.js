const {twoD6} = require("../dice");

// page 132
const habitabilityRating = (planet) => {
  let hr = 10;
  if (planet.size <= 4)
    hr -= 1;
  if (planet.size >= 9)
    hr += 1;
  if (planet.atmosphere.code >= 15)
    hr -= 10;
  else
    switch (planet.atmosphere.code) {
      case 0:
      case 1:
      case 10:
        hr -= 8;
        break;
      case 2:
      case 14:
        hr -= 4;
        break;
      case 3:
      case 13:
        hr -= 3;
        break;
      case 4:
      case 9:
        hr -= 2;
        break;
      case 5:
      case 7:
      case 8:
        hr -= 1;
        break;
      case 11:
        hr -= 10;
        break;
      case 12:
        hr -= 12;
        break;
    }

  switch (planet.hydrographics.code) {
    case 0:
      hr -= 4;
      break;
    case 1:
    case 2:
    case 3:
      hr -= 2;
      break;
    case 9:
      hr -= 1;
      break;
    case 10:
      hr -= 2;
      break;
  }

  if (planet.meanTemperature > 323)
    hr -= 4;
  else if (planet.meanTemperature < 273)
    hr -= 2;
  else if (planet.meanTemperature >= 304 && planet.meanTemperature <= 323)
    hr -= 2;
  if (planet.gravity <= 0.2)
    hr -= 4;
  else if (planet.gravity > 0.2 && planet.gravity <= 0.4)
    hr -= 2;
  else if (planet.gravity > 0.4 && planet.gravity <= 0.7)
    hr -= 1;
  else if (planet.gravity > 0.7 && planet.gravity <= 0.9)
    hr += 1;
  else if (planet.gravity > 1.1 && planet.gravity <= 1.4)
    hr -= 1;
  else if (planet.gravity > 1.4 && planet.gravity < 2.0)
    hr -= 3;
  else if (planet.gravity >= 2)
    hr -= 6;

  return Math.max(0, hr);
}

module.exports = habitabilityRating;
