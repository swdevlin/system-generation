const { d6, d3 } = require('../dice');

function starPortTechLevelDMs(planet) {
  if (planet.starport === 'A') return 6;
  else if (planet.starport === 'B') return 4;
  else if (planet.starport === 'C') return 2;
  else if (planet.starport === 'X') return -4;
  return 0;
}

function techLevelDMs(planet) {
  let dm = 0;
  if (planet.size < 2) dm += 2;
  else if (planet.size <= 4) dm += 1;

  if (planet.atmosphere.code <= 3) dm += 1;
  else if (planet.atmosphere.code >= 10 && planet.atmosphere.code <= 17) dm += 1;

  if (planet.hydrographics.code === 0) dm += 1;
  else if (planet.hydrographics.code === 9) dm += 1;
  else if (planet.hydrographics.code === 10) dm += 2;

  if (planet.population.code >= 1 && planet.population.code <= 5) dm += 1;
  else if (planet.population.code === 8) dm += 1;
  else if (planet.population.code === 9) dm += 2;
  else if (planet.population.code >= 10) dm += 4;

  if (planet.government.code === 0) dm += 1;
  else if (planet.government.code === 5) dm += 1;
  else if (planet.government.code === 7) dm += 2;
  else if (planet.government.code === 13) dm -= 2;
  else if (planet.government.code === 14) dm -= 2;

  dm += starPortTechLevelDMs(planet);

  return dm;
}

function nativeSophontTechLevelDMs(star, planet) {
  let dm = 0;
  if (star.age < 1) dm -= 1;
  else if (star.age >= 2 && star.age < 4) dm += 1;
  else if (star.age >= 4) dm += 2;

  if (planet.government.code === 1) dm += 1;
  else if (planet.government.code === 5) dm += 1;
  else if (planet.government.code === 7) dm += 1;

  if (planet.population.code > 7) dm += 1;
  return dm;
}

function assignTechLevel(planet) {
  planet.techLevel.code = d6() + techLevelDMs(planet);
}

function assignNativeSophontTechLevel(star, planet, maxNativeSophontTechLevel = 15) {
  planet.techLevel.code = Math.min(
    maxNativeSophontTechLevel,
    Math.max(1, d3() + d3() + d3() - 2 + nativeSophontTechLevelDMs(star, planet))
  );
}

module.exports = {
  assignTechLevel,
  assignNativeSophontTechLevel,
  techLevelDMs,
  nativeSophontTechLevelDMs,
  starPortTechLevelDMs,
};
