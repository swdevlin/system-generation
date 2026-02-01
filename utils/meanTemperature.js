const {twoD6, d6} = require("../dice");
const orbitToAU = require("./orbitToAU");
const fs = require('fs');

const TEMPERATURE_LOOKUP = [
  -85, -75, -55, -35, -10, 5, 10, 15, 20, 25, 40, 65, 115
];

// page 108
meanTemperature = (star, planet) => {
  let roll = 7;

  // page 47
  let mod = 0;

  switch (planet.atmosphere.code) {
    case 2:
    case 3:  mod = -2; break;
    case 4:
    case 5:
    case 14: mod = -1; break;
    case 8:
    case 9:  mod =  1; break;
    case 10:
    case 13:
    case 15: mod =  2; break;
    case 11:
    case 12: mod =  6; break;
  }

  roll += mod;

  if (planet.orbit < star.hzco - 1) {
    roll += 4 + Math.round(((star.hzco - 1) - planet.orbit) / 0.5);
  } else if (planet.orbit > star.hzco + 1) {
    roll -= 4;
    roll -= Math.round((planet.orbit - (star.hzco+1)) / 0.5);
  }

  let temp;
  if (roll < 0)
    temp = -85 + roll * 5;
  else if (roll > 12)
    temp = 115 + (roll-12) * 50;
  else
    temp = TEMPERATURE_LOOKUP[roll];

  if (Math.abs(planet.effectiveHZCODeviation) < 1)
    temp -= planet.effectiveHZCODeviation * 10;

  let k = 273 + temp;
  if (k < 10)
    k = d6() + 5;

  return k;
}

module.exports = meanTemperature;


/*

const {twoD6, d6} = require("../dice");
const orbitToAU = require("./orbitToAU");

const TEMPERATURE_LOOKUP = [
  -85, -75, -55, -35, -10, 5, 10, 15, 20, 25, 40, 65, 115
];

meanTemperature = (star, planet) => {
  let r = (star.luminosity * (1-planet.albedo) * (1+planet.greenhouse))/Math.pow(orbitToAU(planet.orbit), 2);
  let k = 279 * Math.pow(r, 0.25);
  let roll = 7;
  if ([2, 3].includes(planet.atmosphere.code) )
    roll -= 2;
  if ([4, 5, 'E'].includes(planet.atmosphere.code) )
    roll -= 1;
  if ([8, 9].includes(planet.atmosphere.code) )
    roll += 1;
  if (['A', 'D', 'F'].includes(planet.atmosphere.code) )
    roll += 2;
  if (['B', 'C'].includes(planet.atmosphere.code) )
    roll += 6;

  if (planet.orbit < star.hzco - 1)
    roll += 4 + Math.round(((star.hzco - 1) - planet.orbit) / 0.5);
  else if (planet.orbit > star.hzco + 1) {
    roll -= 4;
    roll -= Math.round((planet.orbit - (star.hzco+1)) / 0.5);
  }
  let temp;
  if (roll < 0)
    temp = -85 + roll * 5;
  else if (roll > 12)
    temp = 115 + (roll-12) * 50;
  else temp = TEMPERATURE_LOOKUP[roll];
  console.log(k-273, temp, 100*(k-273-temp)/temp);
  return temp;
}


 */
