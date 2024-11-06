const {twoD6} = require("../dice");

// page 131
const resourceRating = (planet) => {
  let rr = twoD6() - 7;
  if (planet.size !== 'S' && planet.size !== 'R')
    rr += planet.size;
  if (planet.density > 1.12)
    rr += 2;
  if (planet.density < 0.5)
    rr -= 2;
  if (planet.biomassRating >= 3)
    rr += 2;
  if (planet.biodiversityRating >= 8 && planet.biodiversityRating <= 10)
    rr += 1;
  if (planet.biodiversityRating >= 11)
    rr += 2;
  if (planet.biomassRating >= 1 && planet.compatibilityRating < 4)
    rr -= 1;
  if (planet.compatibilityRating >= 8)
    rr += 2;

  return Math.max(2, Math.min(12, rr));
}

module.exports = resourceRating;
