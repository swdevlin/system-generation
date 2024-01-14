const {determineStarClassification, primaryStarClassification} = require("../stars/determineStarClassification");
const Star = require("../stars/star");
const {ORBIT_TYPES, companionOrbit, calculatePeriod, additionalStarDM} = require("../utils");
const predefinedClassification = require("../stars/predefinedClassification");
const starFromDefinition = require("../stars/starFromDefinition");
const generateCloseSecondary = require("../stars/generateCloseSecondary");
const generateNearSecondary = require("../stars/generateNearSecondary");
const generateFarSecondary = require("../stars/generateFarSecondary");
const {twoD6, d6} = require("../dice");
const addCompanion = require("../stars/addCompanion");
const {gasGiantQuantity} = require("../gasGiants");
const {planetoidBeltQuantity} = require("../planetoidBelts");
const terrestrialPlanetQuantity = require("../terrestrialPlanet/terrestrialPlanetQuantity");

const loadPlanetsFromDefinition = ({sector, subsector, definition, solarSystem}) => {
  const primary = solarSystem.primaryStar;
  if (definition.bodies) {
    primary.totalObjects = 20;
    primary.assignOrbits();
    primary.totalObjects = definition.bodies.length;
    let orbitIndex = 0;
    for (const body of definition.bodies) {
      if (body !== 'empty') {
        if (body.habitable) {
          if (body.habitable === 'outer')
            while (primary.occupiedOrbits[orbitIndex] <= primary.hzco)
              orbitIndex++;
          else if (body.habitable === 'inner')
            while (primary.occupiedOrbits[orbitIndex + 1] < primary.hzco)
              orbitIndex++;
          else
            while (primary.occupiedOrbits[orbitIndex] < primary.hzco)
              orbitIndex++;
        }
        solarSystem.preassignedBody({star: solarSystem.primaryStar, body: body, orbitIndex: orbitIndex});
      } else
        solarSystem.primaryStar.totalObjects--;
      orbitIndex++;
    }
  } else if (definition.randomBodies) {
    solarSystem.gasGiants = definition.randomBodies.gasGiants;
    solarSystem.planetoidBelts = definition.randomBodies.planetoidBelts;
    solarSystem.terrestrialPlanets = definition.randomBodies.terrestrialPlanets;
    solarSystem.distributeObjects();
    solarSystem.assignOrbits();
  } else {
    solarSystem.gasGiants = gasGiantQuantity(solarSystem);
    solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem);
    solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(solarSystem);

    solarSystem.distributeObjects();
    solarSystem.assignOrbits();
    solarSystem.addAnomalousPlanets();
  }
}

module.exports = loadPlanetsFromDefinition;
