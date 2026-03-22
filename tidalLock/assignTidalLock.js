const { ORBIT_TYPES } = require('../utils');
const TidalLockDetermination = require('./TidalLockDetermination');

const SKIP_TYPES = new Set([ORBIT_TYPES.PLANETOID_BELT, ORBIT_TYPES.PLANETOID_BELT_OBJECT]);

const assignTidalLock = (stars) => {
  for (const star of stars) {
    const systemAge = star.age;
    for (const stellarObject of star.stellarObjects) {
      if (stellarObject.orbitType <= ORBIT_TYPES.COMPANION) continue;
      if (SKIP_TYPES.has(stellarObject.orbitType)) continue;

      _applyToBody(stellarObject, star, systemAge);

      for (const moon of stellarObject.moons ?? []) {
        if (moon.size === 'S' || moon.size === 'R') continue;
        _applyToMoon(moon, stellarObject, star, systemAge);
      }
    }
  }
};

const _applyToBody = (body, star, systemAge) => {
  const det = new TidalLockDetermination(body, star, systemAge);
  const cases = [det.planetToStarCase()];

  // Planet-to-moon: only for terrestrial bodies with significant moons
  if (body.orbitType === ORBIT_TYPES.TERRESTRIAL) {
    for (const moon of body.moons ?? []) {
      if (typeof moon.size === 'number' && moon.size >= 1) {
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

const _applyToMoon = (moon, parentBody, star, systemAge) => {
  const det = new TidalLockDetermination(moon, star, systemAge);
  det.apply(det.moonToPlanetCase(parentBody));
};

module.exports = assignTidalLock;
