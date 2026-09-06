const { d6 } = require('../dice');
const orbitToAU = require('./orbitToAU');
const auToOrbit = require('./auToOrbit');

const TEMPERATURE_LOOKUP = [-85, -75, -55, -35, -10, 5, 10, 15, 20, 25, 40, 65, 115];

// page 108
const temperatureAtOrbit = (star, planet, stellarOrbit) => {
  let roll = 7;

  // page 47
  let mod = 0;

  switch (planet.atmosphere.code) {
    case 2:
    case 3:
      mod = -2;
      break;
    case 4:
    case 5:
    case 14:
      mod = -1;
      break;
    case 8:
    case 9:
      mod = 1;
      break;
    case 10:
    case 13:
    case 15:
      mod = 2;
      break;
    case 11:
    case 12:
      mod = 6;
      break;
  }

  roll += mod;

  if (stellarOrbit < star.hzco - 1) {
    roll += 4 + Math.round((star.hzco - 1 - stellarOrbit) / 0.5);
  } else if (stellarOrbit > star.hzco + 1) {
    roll -= 4;
    roll -= Math.round((stellarOrbit - (star.hzco + 1)) / 0.5);
  }

  let temp;
  if (roll < 0) temp = -85 + roll * 5;
  else if (roll > 12) temp = 115 + (roll - 12) * 50;
  else temp = TEMPERATURE_LOOKUP[roll];

  const effectiveHZCODeviation =
    star.hzco < 1 || stellarOrbit < 1
      ? (stellarOrbit - star.hzco) / Math.min(star.hzco, stellarOrbit)
      : stellarOrbit - star.hzco;

  if (Math.abs(effectiveHZCODeviation) < 1) temp -= effectiveHZCODeviation * 10;

  let k = 273 + temp;
  if (k < 10) k = d6() + 5;

  return k;
};

const meanTemperature = (star, planet) => {
  const stellarOrbit = planet.satelliteOrbit ? planet.parentOrbit : planet.orbit;
  return temperatureAtOrbit(star, planet, stellarOrbit);
};

const periapsisTemperature = (star, planet) => {
  const stellarOrbit = planet.satelliteOrbit ? planet.parentOrbit : planet.orbit;
  const au = orbitToAU(stellarOrbit) * (1 - (planet.eccentricity || 0));
  return temperatureAtOrbit(star, planet, auToOrbit(au));
};

const apoapsisTemperature = (star, planet) => {
  const stellarOrbit = planet.satelliteOrbit ? planet.parentOrbit : planet.orbit;
  const au = orbitToAU(stellarOrbit) * (1 + (planet.eccentricity || 0));
  return temperatureAtOrbit(star, planet, auToOrbit(au));
};

module.exports = meanTemperature;
module.exports.periapsisTemperature = periapsisTemperature;
module.exports.apoapsisTemperature = apoapsisTemperature;
