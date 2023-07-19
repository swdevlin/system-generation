const {twoD6} = require("./dice");
const Random = require("random-js").Random;

const r = new Random();

const terrestrialPlanetQuantity = (solarSystem) => {
  let terrestrialPlanets= twoD6()-2;
  if (terrestrialPlanets >= 3)
    terrestrialPlanets += r.die(3)-1;
  else
    terrestrialPlanets = r.die(3)+2;
  return terrestrialPlanets;
}

module.exports = {
  terrestrialPlanetQuantity: terrestrialPlanetQuantity,
};
