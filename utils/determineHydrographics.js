const {twoD6, d6} = require("../dice");
const {toHex, hexToInt} = require("../utils");

determineHydrographics = (star, planet)=> {
  const hydrographics = {
    code: 0,
    distribution: 0,
  }
  if (planet.size < 2)
    return hydrographics;
  let roll = twoD6() - 7;
  roll += hexToInt(planet.atmosphere.code);
  if (planet.atmosphere.code === 0 || planet.atmosphere.code === 1 || planet.atmosphere.code >= 'A')
    roll -= 4;
  hydrographics.code = toHex(Math.max(Math.min(10, roll), 0));
  if (hydrographics.code !== 0)
    hydrographics.distribution = twoD6() - 2;
  return hydrographics;
}

module.exports = determineHydrographics;
