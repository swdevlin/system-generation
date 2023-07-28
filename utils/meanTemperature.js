const {twoD6, d6} = require("../dice");

const TEMPERATURE_LOOKUP = [
  -85, -75, -55, -35, -10, 5, 10, 15, 20, 25, 40, 65, 115
];

meanTemperature = (star, planet) => {
  let roll = twoD6();
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
  if (roll < 0)
    return -85 + roll * 5;
  else if (roll > 12)
    return 115 + (roll-12) * 50;
  else return TEMPERATURE_LOOKUP[roll];
}

module.exports = meanTemperature;
