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

const hasBodies = (definition) => {
  if (!definition.primary)
    return false;
  if (definition.primary.bodies && definition.primary.bodies.length > 0)
    return true;

  for (const d of ['close', 'near', 'far']) {
    const star = definition.primary[d];
    if (star && star.bodies && star.bodies.length > 0)
      return true;
  }
  return false;
};

const assignBodies = (star, definition, solarSystem) => {
  if (!definition.bodies)
    return;
  star.totalObjects = 20;
  star.assignOrbits();
  star.totalObjects = definition.bodies.length;
  let orbitIndex = 0;
  for (const body of definition.bodies) {
    if (body !== 'empty') {
      if (body.habitable) {
        if (body.habitable === 'outer')
          while (star.occupiedOrbits[orbitIndex] <= star.hzco)
            orbitIndex++;
        else if (body.habitable === 'inner')
          while (star.occupiedOrbits[orbitIndex + 1] < star.hzco)
            orbitIndex++;
        else
          while (star.occupiedOrbits[orbitIndex] < star.hzco)
            orbitIndex++;
      }
      solarSystem.preassignedBody({star: star, body: body, orbitIndex: orbitIndex});
    } else
      star.totalObjects--;
    orbitIndex++;
  }

};

const loadPlanetsFromDefinition = ({sector, subsector, definition, solarSystem}) => {
  if (hasBodies(definition)) {
    for (const star of solarSystem.stars) {
      switch (star.orbitType) {
        case ORBIT_TYPES.PRIMARY:
          assignBodies(star, definition.primary, solarSystem);
          break;
        case ORBIT_TYPES.CLOSE:
          assignBodies(star, definition.primary.close, solarSystem);
          break;
        case ORBIT_TYPES.NEAR:
          assignBodies(star, definition.primary.near, solarSystem);
          break;
        case ORBIT_TYPES.FAR:
          assignBodies(star, definition.primary.far, solarSystem);
          break;
      }
    }
  } else if (definition.counts) {
    solarSystem.gasGiants = definition.counts.gasGiants;
    solarSystem.planetoidBelts = definition.counts.planetoidBelts;
    solarSystem.terrestrialPlanets = definition.counts.terrestrialPlanets;
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
