const assignAtmosphere = require("./assignAtmosphere");

const assignMoonAtmosphere = (star, planet, moon) => {
  const orbit = moon.orbit;
  moon.orbit = planet.orbit;
  assignAtmosphere(star, moon);
  moon.orbit = orbit;
}

module.exports = assignMoonAtmosphere;
