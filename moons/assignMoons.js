const {twoD6, d6, threeD6, d3} = require("../dice");
const {ORBIT_TYPES, hillSpherePD, eccentricity, axialTilt} = require("../utils");
const Moon = require("./moon");

const Random = require("random-js").Random;
const r = new Random();

const moonOrbit = (mor, dm) => {
  let orbit;
  let zone;
  switch (d6()+dm) {
    case 1:
    case 2:
    case 3:
      orbit = (twoD6() - 2) * mor/60 + 2;
      zone = 'inner';
      break;
    case 4:
    case 5:
      orbit = (twoD6() - 2) * mor/30 + mor/6 + 3;
      zone = 'middle';
      break;
    default:
      orbit = (twoD6() - 2) * mor/20 + mor/2 + 4;
      zone = 'outer';
      break;
  }

  return {
    zone: zone,
    orbit: orbit,
  };
}

const assignMoons = (star) => {
  for (const stellarObject of star.stellarObjects) {
    if (stellarObject.orbitType < ORBIT_TYPES.GAS_GIANT) {
      assignMoons(stellarObject);
    } else {

      let dm = 0;
      if (stellarObject.orbit < 1)
        dm += 1;
      if (star.orbitAdjacentToUnavailabilityZone(stellarObject.orbit))
        dm += 1;
      if (star.orbitAdjacentToOuterMostUnavailability(stellarObject.orbit))
        dm += 1;
      let moons= -1;
      if (stellarObject.orbitType === ORBIT_TYPES.GAS_GIANT) {
        moons = (stellarObject.code === 'GS') ? threeD6() - 7 - 3 * dm : threeD6() + d6() - 6 - 4 * dm;
      } else if (![ORBIT_TYPES.PLANETOID_BELT, ORBIT_TYPES.PLANETOID_BELT_OBJECT].includes(stellarObject.orbitType)) {
        if (stellarObject.size === 'S')
          continue;
        if (stellarObject.size >= 1 && stellarObject.size <= 2) {
          moons = d6() - 5 - dm;
        } else if (stellarObject.size >= 3 && stellarObject.size <= 9) {
          moons = twoD6() - 8 - dm * 2;
        } else if (stellarObject.size >= 10 && stellarObject.size <= 15) {
          moons = twoD6() - 6 - dm * 2;
        }
      }
      if (moons < 0)
        continue;
      const pd = hillSpherePD(star, stellarObject);
      const hsml = pd / 2;
      const rocheLimit = 1.537 * stellarObject.diameter;
      let mor = Math.floor(hsml) - 2;
      mor = Math.min(mor, 200+moons);
      if (hsml < 0.5)
        continue;
      else if (hsml < 1)
        moons = 0;
      if (moons === 0) {
        stellarObject.hasRing = true;
      } else {
        for (let i = 0; i < moons; i++) {
          let size;
          let orbit;
          switch (d6()) {
            case 1:
            case 2:
            case 3:
              size = 'S';
              break
            case 4:
            case 5:
              size = d3() - 1;
              break
            case 6:
              if (stellarObject.orbitType === ORBIT_TYPES.GAS_GIANT) {
                switch (d6()) {
                  case 1:
                  case 2:
                  case 3:
                    size = d6();
                    break;
                  case 4:
                  case 5:
                    size = twoD6() - 2;
                    break;
                  case 6:
                    size = twoD6() + 4
                    break;
                }
              } else {
                size = stellarObject.size - 1 - d6();
                if (size < 0)
                  size = 'S';
              }
              break;
          }
          let dm = mor < 60 ? 1 : 0;
          orbit = moonOrbit(mor, dm);
          const orbitMod = pd * r.real(0, 0.25);
          if (orbitMod < 0 && Math.abs(orbitMod) > orbit.orbit)
            orbit.orbit += 0;
          orbit.orbit = orbit.orbit + orbitMod;
          if (orbit.zone === 'inner')
            dm = -1;
          else if (orbit.zone === 'middle')
            dm = 1;
          else if (orbit.zone === 'outer')
            dm = 4;
          if (orbit.orbit > mor)
            dm += 2;
          let ecc = eccentricity(dm);
          const psize = size === 'S' ? 0.333 : size;
          let period = 0.176927 * Math.sqrt(((pd * psize)**3)/stellarObject.mass);
          if (orbit.orbit > hsml)
            dm += 2;
          if (twoD6()+dm > 9)
            period *= -1;

          const moon = new Moon();
          moon.orbit = orbit;
          moon.size = size;
          moon.eccentricity = ecc;
          moon.hydrographics.code = 0;
          stellarObject.moons.push(moon);
          moon.axialTilt = axialTilt();
        }
      }
      stellarObject.moons.sort((a, b) => Math.abs(a.orbit.orbit) - Math.abs(b.orbit.orbit));
    }
  }
}

module.exports = assignMoons;
