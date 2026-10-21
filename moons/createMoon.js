const { twoD6, d6, d3 } = require('../dice');
const { ORBIT_TYPES, hillSpherePD, eccentricity, axialTilt, AU } = require('../utils');
const Moon = require('./moon');

const Random = require('random-js').Random;
const r = new Random();

const moonOrbit = (mor, dm) => {
  let orbit;
  let zone;
  switch (d6() + dm) {
    case 1:
    case 2:
    case 3:
      orbit = ((twoD6() - 2) * mor) / 60 + 2;
      zone = 'inner';
      break;
    case 4:
    case 5:
      orbit = ((twoD6() - 2) * mor) / 30 + mor / 6 + 3;
      zone = 'middle';
      break;
    default:
      orbit = ((twoD6() - 2) * mor) / 20 + mor / 2 + 4;
      zone = 'outer';
      break;
  }

  return {
    zone: zone,
    orbit: orbit,
  };
};

const moonOrbitParameters = (star, stellarObject) => {
  const pd = hillSpherePD(star, stellarObject);
  const hsml = pd / 2;
  return { pd, hsml };
};

const rollMoonSize = (stellarObject) => {
  let size;
  switch (d6()) {
    case 1:
    case 2:
    case 3:
      size = 'S';
      break;
    case 4:
    case 5:
      size = d3() - 1;
      break;
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
            size = twoD6() + 4;
            break;
        }
      } else {
        size = stellarObject.size - 1 - d6();
        if (size < 0) size = 'S';
      }
      break;
  }
  return size;
};

const createMoon = ({ stellarObject, mor, hsml, pd, size, uwp }) => {
  if (!uwp && size === undefined) size = rollMoonSize(stellarObject);

  let dm = mor < 60 ? 1 : 0;
  const orbit = moonOrbit(mor, dm);
  const orbitMod = pd * r.real(0, 0.25);
  if (orbitMod < 0 && Math.abs(orbitMod) > orbit.orbit) orbit.orbit += 0;
  orbit.orbit = orbit.orbit + orbitMod;
  if (orbit.zone === 'inner') dm = -1;
  else if (orbit.zone === 'middle') dm = 1;
  else if (orbit.zone === 'outer') dm = 4;
  if (orbit.orbit > mor) dm += 2;
  const ecc = eccentricity(dm);
  const orbitAU = (orbit.orbit * stellarObject.diameter) / AU;
  let period = Math.sqrt(orbitAU ** 3 / (stellarObject.mass * 3e-6));
  if (orbit.orbit > hsml) dm += 2;
  if (twoD6() + dm > 9) period *= -1;
  period *= 365.25;

  const moon = new Moon(size, uwp);
  moon.satelliteOrbit = orbit;
  moon.orbit = orbit.orbit;
  moon.parentOrbit = stellarObject.orbit;
  moon.hzcoDeviation = stellarObject.hzcoDeviation;
  moon.eccentricity = ecc;
  moon.axialTilt = axialTilt();
  moon.period = period;
  stellarObject.moons.push(moon);
  return moon;
};

module.exports = { moonOrbit, moonOrbitParameters, rollMoonSize, createMoon };
