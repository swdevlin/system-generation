const determineAtmosphere = require("./determineAtmosphere");

const determineMoonAtmosphere = (star, planet, moon) => {
  const orbit = moon.orbit;
  moon.orbit = planet.orbit;
  const atmosphere = determineAtmosphere(star, moon);
  moon.orbit = orbit;
  return atmosphere;
}

module.exports = determineMoonAtmosphere;
