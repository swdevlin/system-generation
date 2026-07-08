const { twoD6 } = require('../dice');

function starportDMs(planet) {
  let dm = 0;
  if (planet.population.code <= 2) dm -= 2;
  else if (planet.population.code <= 4) dm -= 1;
  else if (planet.population.code >= 8 && planet.population.code <= 9) dm += 1;
  else if (planet.population.code >= 10) dm += 2;

  return dm;
}

function assignNativeSophontStarport(planet) {
  if (planet.techLevel.code < 9) planet.starPort = 'X';
  else {
    const roll = twoD6() + starportDMs(planet);
    if (roll <= 2) planet.starPort = 'X';
    else if (roll <= 4) planet.starPort = 'E';
    else if (roll <= 6) planet.starPort = 'D';
    else if (roll <= 8) planet.starPort = 'C';
    else if (roll <= 10) planet.starPort = 'B';
    else planet.starPort = 'A';
  }
}

function determineStarport(planet) {
  let roll = twoD6() + starportDMs(planet);
  if (planet.population.code <= 2) roll -= 2;
  else if (planet.population.code === 3 || planet.population.code === 4) roll -= 1;
  else if (planet.population.code === 8 || planet.population.code === 9) roll += 1;
  else if (planet.population.code >= 10) roll += 2;
  if (roll <= 2) return 'X';
  else if (roll <= 4) return 'E';
  else if (roll <= 6) return 'D';
  else if (roll <= 8) return 'C';
  else if (roll <= 10) return 'B';
  else return 'A';
}

const determineBases = (starport) => {
  let navalTN = null;
  let scoutTN = null;
  let militaryTN = null;

  switch (starport) {
    case 'A':
      navalTN = 8;
      scoutTN = 10;
      militaryTN = 8;
      break;
    case 'B':
      navalTN = 8;
      scoutTN = 9;
      militaryTN = 8;
      break;
    case 'C':
      scoutTN = 9;
      militaryTN = 10;
      break;
    case 'D':
      scoutTN = 8;
      break;
  }
  let bases = [];

  if (navalTN && twoD6() >= navalTN)
    bases.push('N');
  if (scoutTN && twoD6() >= scoutTN)
    bases.push('S');
  if (militaryTN && twoD6() >= militaryTN)
    bases.push('M');

  return bases;
};

module.exports = {
  assignNativeSophontStarport,
  determineStarport,
  determineBases,
  starportDMs,
};
