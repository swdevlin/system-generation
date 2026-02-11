const loadStarsFromDefinition = require('../solarSystems/loadStarsFromDefinition');
const assignStars = require('../solarSystems/assignStars');
const loadPlanetsFromDefinition = require('../solarSystems/loadPlanetsFromDefinition');
const { gasGiantQuantity } = require('../gasGiants');
const { planetoidBeltQuantity } = require('../planetoidBelts');
const terrestrialPlanetQuantity = require('../terrestrialPlanet/terrestrialPlanetQuantity');
const { assignTradeCodes } = require('../economics/assignTradeCodes');
const SolarSystem = require('../solarSystems/solarSystem');

const generateStarSystem = (definition, subsector) => {
  const sector = { unusualChance: subsector?.unusualChance || 0 };
  const systemName = definition?.name;
  let unusualChance = (subsector?.unusualChance || 0) / 100.0;
  const solarSystem = new SolarSystem(systemName);
  const si = definition?.surveyIndex || subsector?.defaultSI || 0;

  if (definition) {
    solarSystem.known = definition.known ? definition.known : false;
    if (definition.bases) {
      solarSystem.bases = definition.bases;
    }
    loadStarsFromDefinition({
      sector: sector,
      subsector: subsector,
      definition: definition,
      solarSystem: solarSystem,
    });
  } else {
    assignStars({ solarSystem: solarSystem, unusualChance: unusualChance });
  }

  if (solarSystem.onlyBrownDwarfs()) solarSystem.surveyIndex = 0;
  else solarSystem.surveyIndex = si;

  solarSystem.determineAvailableOrbits();

  if (definition) {
    loadPlanetsFromDefinition({
      sector: sector,
      subsector: subsector,
      definition: definition,
      solarSystem: solarSystem,
    });
  } else {
    solarSystem.gasGiants = gasGiantQuantity(solarSystem);
    solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem);
    solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(solarSystem);

    solarSystem.distributeObjects();
    solarSystem.assignOrbits();
    solarSystem.addAnomalousPlanets();
  }
  solarSystem.addMoons();
  solarSystem.setRotationPeriod();
  solarSystem.assignAtmospheres();
  solarSystem.assignBiomass();
  solarSystem.assignResourceRatings();
  solarSystem.assignHabitabilityRatings();
  solarSystem.assignOrbitSequences();

  if (definition?.allegiance) solarSystem.allegiance = definition.allegiance;

  if (definition?.populated && !solarSystem.allegiance)
    solarSystem.allegiance = definition.populated.allegiance;

  if (definition?.populated) {
    solarSystem.assignMainWorldSocialCharacteristics(definition.populated);
    assignTradeCodes(solarSystem.mainWorld);
  }

  solarSystem.mainWorldOrbitSequence = solarSystem.mainWorld?.orbitSequence;
  solarSystem.setOrbitPositions();
  return solarSystem;
};

module.exports = generateStarSystem;
