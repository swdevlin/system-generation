const { ORBIT_TYPES } = require('../utils');
const { gasGiantQuantity } = require('../gasGiants/gasGiant');
const { planetoidBeltQuantity } = require('../planetoidBelts');
const terrestrialPlanetQuantity = require('../terrestrialPlanet/terrestrialPlanetQuantity');

const LABEL_TARGETS = {
  warm: (hzco) => hzco,
  cold: (hzco) => hzco + 1,
  habitable: (hzco) => hzco + 1,
  inner: (hzco) => hzco - 1,
};

const computeMaxSpread = (star, bodies) => {
  let maxSpread = null;
  for (let i = 1; i < bodies.length; i++) {
    const label = bodies[i].orbit;
    if (!label || !(label in LABEL_TARGETS)) continue;
    const target = LABEL_TARGETS[label](star.hzco);
    if (target <= star.minimumAllowableOrbit) continue;
    const candidate = (target - star.minimumAllowableOrbit) / ((i + 1) * 1.3);
    if (maxSpread === null || candidate < maxSpread) maxSpread = candidate;
  }
  return maxSpread;
};

const hasBodies = (definition) => {
  if (!definition.primary) return false;
  if (definition.primary.bodies) return true;

  for (const d of ['close', 'near', 'far']) {
    const star = definition.primary[d];
    if (star && star.bodies) return true;
  }
  return false;
};

const assignBodies = (star, definition, solarSystem) => {
  if (!definition.bodies) return;
  let loops = 1;
  let orbitIndex;
  const maxSpread = computeMaxSpread(star, definition.bodies);
  do {
    star.resetNonStarBodies(definition.bodies.length + loops, maxSpread);
    if (star.occupiedOrbits.length === 0) {
      console.log(
        `${solarSystem.sector} ${solarSystem.coordinates} ${definition.type} has no possible orbits`
      );
      return;
    }

    orbitIndex = 0;
    for (const body of definition.bodies) {
      orbitIndex = star.nextOrbit(body, orbitIndex);
      if (orbitIndex > star.occupiedOrbits.length - 1) break;
      const newSO = solarSystem.preassignedBody({ star: star, body: body, orbitIndex: orbitIndex });
      if (!newSO) continue;
      newSO.name = body.name ? body.name : null;
      if (body.mainWorld) solarSystem._mainWorld = newSO;
    }
    loops++;
  } while (orbitIndex > star.occupiedOrbits.length - 1);
};

const loadPlanetsFromDefinition = ({ definition, solarSystem }) => {
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
  } else {
    solarSystem.gasGiants = gasGiantQuantity(solarSystem, definition.densityIndex);
    solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem, definition.densityIndex);
    solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(
      solarSystem,
      definition.densityIndex
    );
  }
  if (!hasBodies(definition)) {
    solarSystem.distributeObjects();
    solarSystem.assignOrbits();
    if (definition.counts) {
      if (solarSystem.mainWorldType === 'moon') solarSystem.uwp = definition.counts.mainWorld?.uwp;
    } else solarSystem.addAnomalousPlanets();
  }
};

module.exports = loadPlanetsFromDefinition;
module.exports.computeMaxSpread = computeMaxSpread;
