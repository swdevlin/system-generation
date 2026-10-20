const { ORBIT_TYPES } = require('../utils');
const TidalLockDetermination = require('./TidalLockDetermination');

const SKIP_TYPES = new Set([ORBIT_TYPES.PLANETOID_BELT, ORBIT_TYPES.PLANETOID_BELT_OBJECT]);

const assignTidalLock = (stars) => {
  for (const star of stars) {
    const systemAge = star.age;
    for (const stellarObject of star.stellarObjects) {
      if (stellarObject.orbitType <= ORBIT_TYPES.COMPANION) continue;
      if (SKIP_TYPES.has(stellarObject.orbitType)) continue;

      for (const moon of stellarObject.moons ?? []) {
        if (moon.size === 'S' || moon.size === 'R') continue;
        applyToMoon(moon, stellarObject, star, systemAge);
      }

      applyToBody(stellarObject, star, systemAge);
    }
  }
};

const applyToBody = (body, star, systemAge) => {
  const det = new TidalLockDetermination(body, star, systemAge);
  const cases = [det.planetToStarCase()];

  // Planet-to-moon: only for terrestrial bodies with a moon already confirmed
  // locked (3:2 or 1:1) to this planet
  if (body.orbitType === ORBIT_TYPES.TERRESTRIAL) {
    for (const moon of body.moons ?? []) {
      const lockedToThisPlanet =
        (moon.tidalLock === '3:2' || moon.tidalLock === '1:1') && moon.tidalLockTarget === body;
      if (typeof moon.size === 'number' && moon.size >= 1 && lockedToThisPlanet) {
        cases.push(det.planetToMoonCase(moon));
      }
    }
  }

  // Pick the case with the highest total DM; prefer planet-to-moon on a tie
  cases.sort((a, b) => {
    if (b.totalDM !== a.totalDM) return b.totalDM - a.totalDM;
    return a.name === 'planet-to-moon' ? -1 : 1;
  });

  det.apply(cases[0]);
};

const applyToMoon = (moon, parentBody, star, systemAge) => {
  const det = new TidalLockDetermination(moon, star, systemAge);
  det.apply(det.moonToPlanetCase(parentBody));
};

module.exports = assignTidalLock;
