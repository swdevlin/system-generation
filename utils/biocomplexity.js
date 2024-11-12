const {twoD6} = require("../dice");

// page 129
const biocomplexity = (star, planet) => {
  if (planet.biomassRating === 0)
    return 0;

  let b = twoD6() - 7 + planet.biomassRating;
  if (planet.atmosphere.code < 3 || planet.atmosphere.code > 9)
    b -= 2;
  if (star.age > 3 && star.age <= 4)
    b -= 2;
  if (star.age > 2 && star.age <= 3)
    b -= 4;
  if (star.age >= 1 && star.age <= 2)
    b -= 8;
  if (star.age < 1)
    b -= 10;

  if (planet.atmosphere.taint && [2, 3, 4, 5].includes(planet.atmosphere.code))
    b -= 2;

  return Math.min(Math.max(b, 1), 10);
}

module.exports = biocomplexity;
