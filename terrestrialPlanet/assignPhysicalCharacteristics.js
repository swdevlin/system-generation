const terrestrialComposition = require("./terrestrialComposition");
const terrestrialDensity = require("./terrestrialDensity");
const {eccentricity, axialTilt, determineHydrographics, ORBIT_TYPES} = require("../utils");
const inclination = require("../utils/inclination");
const assignAtmosphere = require("../atmosphere/assignAtmosphere");
const calculateAlbedo = require("../atmosphere/albedo");
const calculateGreenhouse = require("../atmosphere/calculateGreenhouse");

const assignPhysicalCharacteristics = (star, planet, uwp) => {
  planet.composition = terrestrialComposition(star, planet);
  planet.density = terrestrialDensity(planet.composition);
  planet.eccentricity = eccentricity(0);
  planet.inclination = inclination();
  planet.axialTilt = axialTilt();
  if (!uwp)
    if (planet.atmosphere.code === null)
      assignAtmosphere(star, planet);
  if (!uwp)
    if (planet.hydrographics.code === null)
      planet.hydrographics = determineHydrographics(star, planet);
  planet.albedo = calculateAlbedo(star, planet);
  planet.greenhouse = calculateGreenhouse(planet);

}

module.exports = assignPhysicalCharacteristics;
