const {twoD6, d3} = require("../dice");
const densityIndexDM = require("../utils/densityIndexDM");

const terrestrialPlanetQuantity = (solarSystem, densityIndex) => {
  let terrestrialPlanets= twoD6()-2;
  terrestrialPlanets += densityIndexDM(densityIndex);

  if (terrestrialPlanets >= 3)
    terrestrialPlanets += d3()-1;
  else
    terrestrialPlanets = d3()+2;

  return terrestrialPlanets;
}

module.exports = terrestrialPlanetQuantity;
