const determineAtmosphere = require("./determineAtmosphere");

determineMoonAtmosphere = (star, planet, moon) => {
  const orbit = moon.orbit;
  moon.orbit = planet.orbit;
  const atmosphere = determineAtmosphere(star, moon);
  moon.orbit = orbit;
  return atmosphere;
}

module.exports = determineMoonAtmosphere;
