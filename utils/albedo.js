const {AU, orbitToAU, ORBIT_TYPES} = require("./index");
const {twoD6, d6} = require("../dice");
const Random = require("random-js").Random;
const r = new Random();

const calculateAlbedo = (planet) => {
  if (typeof planet === 'GasGiant') {
    return 0.05 + twoD6() * 0.05;
  }

  let albedo = 0;
  if (planet.density > 0.5)
    albedo += 0.04 + (twoD6()-2) * 0.02;
  if ((planet.atmosphere.code >= 1 && planet.atmosphere.code <= 3) || planet.atmosphere.code === 14)
    albedo += (twoD6()-3) * 0.01;
  else if ((planet.atmosphere.code >= 4 && planet.atmosphere.code <= 9) || planet.atmosphere.code === 14)
    albedo += twoD6() * 0.01;
  else if ((planet.atmosphere.code >= 10 && planet.atmosphere.code <= 12) || planet.atmosphere.code === 15)
    albedo += (twoD6()-2) * 0.05;
  else if (planet.atmosphere.code === 13)
    albedo += twoD6() * 0.03;
  if (planet.hydrographics.code >= 2 && planet.hydrographics.code <= 5)
    albedo += (twoD6()-2) * 0.02;
  else if (planet.hydrographics.code > 6)
    albedo += (twoD6()-4) * 0.03;

  return albedo;
}


module.exports = calculateAlbedo;
