const {twoD6} = require("../dice");

// page 130
const compatibilityRating = (star, planet) => {
  if (planet.biomassRating === 0)
    return 0;

  let cr = twoD6() - planet.biocomplexityCode/2;
  switch (planet.atmosphere.code) {
    case 0:
    case 1:
    case 11:
    case 16:
    case 17:
      cr -= 8;
      break;
    case 3:
    case 5:
    case 8:
      cr += 2;
      break;
    case 10:
    case 15:
      cr -= 6;
      break;
    case 12:
      cr -= 10;
      break;
    case 13:
    case 14:
      cr -= 1;
      break;
  }
  if (planet.atmosphere.taint)
    cr -= 2;

  if (star.age > 8)
    cr -= 2;

  cr = Math.floor(cr);

  return Math.max(0, cr);
}

module.exports = compatibilityRating;
