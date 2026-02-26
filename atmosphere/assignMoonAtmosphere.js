const assignAtmosphere = require("./assignAtmosphere");

const assignMoonAtmosphere = (star, planet, moon) => {
  assignAtmosphere(star, moon);
};

module.exports = assignMoonAtmosphere;
