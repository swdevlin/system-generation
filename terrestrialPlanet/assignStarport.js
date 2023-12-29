const {d3, twoD6} = require("../dice");

function starportDMs(planet) {
  let dm = 0;
  if (planet.populationCode <= 2)
    dm -= 2;
  else if (planet.populationCode <= 4)
    dm -= 1;
  else if (planet.populationCode >= 8 && planet.populationCode <= 9)
    dm += 1;
  else if (planet.populationCode >= 10)
    dm += 2;

  return dm;
}

function assignStarport(planet) {
  if (planet.techLevel < 9)
    planet.starPort = 'X';
  else {
    const roll = twoD6() + starportDMs(planet);
    if (roll <= 2)
      planet.starPort =  'X';
    else if (roll <= 4)
      planet.starPort =  'E';
    else if (roll <= 6)
      planet.starPort =  'D';
    else if (roll <= 8)
      planet.starPort =  'C';
    else if (roll <= 10)
      planet.starPort =  'B';
    else
      planet.starPort =  'A';
  }
}

module.exports = {
  assignStarport: assignStarport,
  starportDMs: starportDMs,
};
