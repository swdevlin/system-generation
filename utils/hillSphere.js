const { AU, orbitToAU, ORBIT_TYPES } = require('./index');

const hillSphere = (star, planet) => {
  let starMass = star.mass;
  for (const stellarObject of star.stellarObjects)
    if (stellarObject.orbit > planet.orbit) break;
    else if (stellarObject.orbitType < ORBIT_TYPES.GAS_GIANT) starMass += stellarObject.mass;
  let pmass = planet.mass * 0.000003;
  // let pmass = planet.orbitType === ORBIT_TYPES.GAS_GIANT ? planet.mass : planet.mass * 0.000003;
  let v = orbitToAU(planet.orbit) * (1 - planet.eccentricity) * (pmass / (3 * starMass)) ** 0.333;
  return v;
};

const hillSpherePD = (star, planet) => {
  let v = hillSphere(star, planet);
  return (v * AU) / planet.diameter;
};

module.exports = {
  hillSphere: hillSphere,
  hillSpherePD: hillSpherePD,
};
