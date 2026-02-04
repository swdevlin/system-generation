const {ORBIT_TYPES} = require("../utils");
const {gasGiantQuantity} = require("../gasGiants");
const {planetoidBeltQuantity} = require("../planetoidBelts");
const terrestrialPlanetQuantity = require("../terrestrialPlanet/terrestrialPlanetQuantity");

const hasBodies = (definition) => {
  if (!definition.primary)
    return false;
  if (definition.primary.bodies)
    return true;

  for (const d of ['close', 'near', 'far']) {
    const star = definition.primary[d];
    if (star && star.bodies)
      return true;
  }
  return false;
};

const assignBodies = (star, definition, solarSystem) => {
  if (!definition.bodies)
    return;
  let loops = 1;
  let orbitIndex;
  do {
    star.resetNonStarBodies(definition.bodies.length+loops);
    if (star.occupiedOrbits.length === 0) {
      console.log(`${solarSystem.sector} ${solarSystem.coordinates} ${definition.type} has no possible orbits`);
      return;
    }

    orbitIndex = 0;
    for (const body of definition.bodies) {
      orbitIndex = star.nextOrbit(body, orbitIndex);
      if (orbitIndex > star.occupiedOrbits.length-1)
        break;
      const newSO = solarSystem.preassignedBody({star: star, body: body, orbitIndex: orbitIndex});
      if (!newSO)
        continue;
      newSO.name = body.name ? body.name : null;
      if (body.mainWorld)
        solarSystem._mainWorld = newSO;
    }
    loops++;
  } while (orbitIndex > star.occupiedOrbits.length-1);

};

const loadPlanetsFromDefinition = ({definition, solarSystem}) => {
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
    solarSystem.gasGiants = definition.counts.gasGiants || 0;
    solarSystem.planetoidBelts = definition.counts.planetoidBelts || 0;
    solarSystem.terrestrialPlanets = definition.counts.terrestrialPlanets || 0;
    if (definition.counts.density) {
      solarSystem.assignFromDensity(definition.counts.density);
    }
    solarSystem.mainFromDefinition = definition.counts.mainWorld || null;
    solarSystem.distributeObjects();
    solarSystem.assignOrbits();
  } else {
    solarSystem.gasGiants = gasGiantQuantity(solarSystem, definition.densityIndex);
    solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem, definition.densityIndex);
    solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(solarSystem, definition.densityIndex);

    solarSystem.distributeObjects();
    solarSystem.assignOrbits();
    solarSystem.addAnomalousPlanets();
  }
}

module.exports = loadPlanetsFromDefinition;
