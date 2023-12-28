const {twoD6, d6} = require("../dice");
const orbitToAU = require("./orbitToAU");
const fs = require('fs');

const TEMPERATURE_LOOKUP = [
  -85, -75, -55, -35, -10, 5, 10, 15, 20, 25, 40, 65, 115
];

// page 108
meanTemperature = (star, planet) => {
  let roll = twoD6();

  if (planet.orbit < star.hzco - 1) {
    roll = 7;
    roll += 4 + Math.round(((star.hzco - 1) - planet.orbit) / 0.5);
  } else if (planet.orbit > star.hzco + 1) {
    roll = 7;
    roll -= 4;
    roll -= Math.round((planet.orbit - (star.hzco+1)) / 0.5);
  }

  // page 47
  if ([2, 3].includes(planet.atmosphere.code) )
    roll -= 2;
  if ([4, 5, 14].includes(planet.atmosphere.code) )
    roll -= 1;
  if ([8, 9].includes(planet.atmosphere.code) )
    roll += 1;
  if ([10, 13, 15].includes(planet.atmosphere.code) )
    roll += 2;
  if ([11, 12].includes(planet.atmosphere.code) )
    roll += 6;

  let temp;
  if (roll < 0)
    temp = -85 + roll * 5;
  else if (roll > 12)
    temp = 115 + (roll-12) * 50;
  else
    temp = TEMPERATURE_LOOKUP[roll];

  let r = (star.totalLuminosity * (1-planet.albedo) * (1+planet.greenhouse))/Math.pow(orbitToAU(planet.orbit), 2);
  let k = 279 * Math.pow(r, 0.25);

  // if (Math.abs(star.hzco - planet.orbit) <= 1) {
  //
  //   const lineToAdd = 'This is the line to add at the end of the file.';
  //
  //   const filePath = 'C:\\Users\\swdev\\projects\\system-generation\\output\\hzco.csv';
  //   const columns = [
  //     star.stellarType, star.stellarClass, star.subtype,  star.totalLuminosity, star.hzco,
  //     planet.orbit, planet.albedo, planet.greenhouse, planet.size, planet.atmosphere.bar, 0.5 * Math.sqrt(planet.atmosphere.bar),
  //     k-272.15, temp
  //   ];
  //
  //   fs.appendFileSync(filePath, columns.join(',') + '\n');
  //
  // }
  return k;
  // console.log(k-272.15, temp, 100*(k-272.15-temp)/temp);

  // return temp;
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
