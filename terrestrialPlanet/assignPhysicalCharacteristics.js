const terrestrialComposition = require("./terrestrialComposition");
const terrestrialDensity = require("./terrestrialDensity");
const {eccentricity, axialTilt, determineHydrographics} = require("../utils");
const inclination = require("../utils/inclination");
const assignAtmosphere = require("../atmosphere/assignAtmosphere");
const calculateAlbedo = require("../atmosphere/albedo");
const calculateGreenhouse = require("../atmosphere/calculateGreenhouse");

const assignPhysicalCharacteristics = (star, planet) => {
  planet.composition = terrestrialComposition(star, planet);
  planet.density = terrestrialDensity(planet.composition);
  planet.eccentricity = eccentricity(0);
  planet.inclination = inclination();
  planet.axialTilt = axialTilt();
  assignAtmosphere(star, planet);
  planet.hydrographics = determineHydrographics(star, planet);
  planet.albedo = calculateAlbedo(star, planet);
  planet.greenhouse = calculateGreenhouse(planet);

}

module.exports = assignPhysicalCharacteristics;
