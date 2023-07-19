const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const allocateObjects = (solarSystem) => {
  let star = solarSystem.primaryStar;
  let totalOrbits = 0;
  let starOrbits = 0;
  for (const o of star.availableOrbits)
    starOrbits += o[1] - o[0];
  if (!star.companion)
    starOrbits += 1;
  star.totalOrbits = Math.trunc(starOrbits);
  totalOrbits += star.totalOrbits;
  for (star of solarSystem.stars) {
    starOrbits = 0;
    for (const o of star.availableOrbits)
      starOrbits += o[1] - o[0];
    if (!star.companion)
      starOrbits += 1;
    star.totalOrbits = Math.trunc(starOrbits);
    totalOrbits += star.totalOrbits;
  }
}

const pickStar = (solarSystem) => {
  let totalOrbits = solarSystem.primaryStar.totalOrbits;
  for (const star of solarSystem.stars)
    totalOrbits += star.totalOrbits;
  let roll = r.integer(1,totalOrbits);
  if (roll <= solarSystem.primaryStar.totalOrbits)
    return solarSystem.primaryStar;
  roll -= solarSystem.primaryStar.totalOrbits;
  for (const star of solarSystem.stars) {
    roll -= star.totalOrbits;
    if (roll <= 0)
      return star
  }
  return null;
}

module.exports = {
  allocateObjects: allocateObjects,
  pickStar: pickStar,
};
