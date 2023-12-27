const {twoD6, d3} = require("../dice");

const terrestrialPlanetQuantity = (solarSystem) => {
  let terrestrialPlanets= twoD6()-2;
  if (terrestrialPlanets >= 3)
    terrestrialPlanets += d3()-1;
  else
    terrestrialPlanets = d3()+2;
  return terrestrialPlanets;
}

module.exports = terrestrialPlanetQuantity;
