const {twoD6} = require("../dice");

determineHydrographics = (star, planet)=> {
  const hydrographics = {
    code: 0,
    distribution: 0,
  }
  if (planet.size < 2)
    return hydrographics;
  let roll = twoD6() - 7;
  roll += planet.atmosphere.code;
  if (planet.atmosphere.code === 0 || planet.atmosphere.code === 1 || planet.atmosphere.code >= 10)
    roll -= 4;
  hydrographics.code = Math.max(Math.min(10, roll), 0);
  if (hydrographics.code !== 0)
    hydrographics.distribution = twoD6() - 2;
  return hydrographics;
}

module.exports = determineHydrographics;
