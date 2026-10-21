const { threeD6, d6, twoD6 } = require('../dice');
const { ORBIT_TYPES } = require('../utils');
const { moonOrbitParameters, createMoon } = require('./createMoon');
const applyMoonRemoval = require('./applyMoonRemoval');
const RingGenerator = require('../rings/RingGenerator');

const assignMoons = (star) => {
  for (const stellarObject of star.stellarObjects) {
    if (stellarObject.orbitType < ORBIT_TYPES.GAS_GIANT) {
      assignMoons(stellarObject);
    } else if (!stellarObject.moonsFromDefinition) {
      let dm = 0;
      if (stellarObject.orbit < 1) dm += 1;
      if (star.orbitAdjacentToUnavailabilityZone(stellarObject.orbit)) dm += 1;
      if (star.orbitAdjacentToOuterMostUnavailability(stellarObject.orbit)) dm += 1;
      let moons = -1;
      if (stellarObject.orbitType === ORBIT_TYPES.GAS_GIANT) {
        moons =
          stellarObject.code === 'GS' ? threeD6() - 7 - 3 * dm : threeD6() + d6() - 6 - 4 * dm;
        if (stellarObject.isMainWorldHost) moons = Math.max(moons, 1);
      } else if (
        ![ORBIT_TYPES.PLANETOID_BELT, ORBIT_TYPES.PLANETOID_BELT_OBJECT].includes(
          stellarObject.orbitType
        )
      ) {
        if (stellarObject.size === 'S') continue;
        if (stellarObject.size >= 1 && stellarObject.size <= 2) {
          moons = d6() - 5 - dm;
        } else if (stellarObject.size >= 3 && stellarObject.size <= 9) {
          moons = twoD6() - 8 - dm * 2;
        } else if (stellarObject.size >= 10 && stellarObject.size <= 15) {
          moons = twoD6() - 6 - dm * 2;
        }
      }
      if (moons < 0) continue;
      const { pd, hsml } = moonOrbitParameters(star, stellarObject);
      // const rocheLimit = 1.537 * stellarObject.diameter;
      let mor = Math.floor(hsml) - 2;
      mor = Math.min(mor, 200 + moons);
      const adjustedMoons = applyMoonRemoval({
        hsml,
        moons,
        isMainWorldHost: stellarObject.isMainWorldHost,
      });
      if (adjustedMoons === null) continue;
      moons = adjustedMoons;
      if (stellarObject.isMainWorldHost && mor < 5) mor = 5;
      if (moons === 0) {
        stellarObject.hasRing = true;
        stellarObject.rings.push(...RingGenerator.generate(1));
      } else {
        for (let i = 0; i < moons; i++) {
          createMoon({ star, stellarObject, mor, hsml, pd });
        }
      }
      stellarObject.moons.sort(
        (a, b) => Math.abs(a.satelliteOrbit.orbit) - Math.abs(b.satelliteOrbit.orbit)
      );
    }
  }
};

module.exports = assignMoons;
