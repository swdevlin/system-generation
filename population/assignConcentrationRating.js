const { d6 } = require('../dice');
const {
  isIndustrial,
  isRich,
  isAgricultural,
  isNonAgricultural,
} = require('../economics/assignTradeCodes');

// page 151
const concentrationRatingDMs = (planet) => {
  let dm = 0;

  if (planet.size === 1) dm += 2;
  else if (planet.size >= 2 && planet.size <= 3) dm += 1;

  if (planet.twilightZone) dm += 2;

  // Minimal sustainable TL
  if (planet.minimalTL >= 8) {
    dm += 3;
  } else if (planet.minimalTL >= 3 && planet.minimalTL <= 7) {
    dm += 1;
  }

  if (planet.population.code === 8) dm -= 1;
  else if (planet.population.code >= 9) dm -= 2;

  if (planet.governmentCode === 7) dm -= 2;

  // Tech Level
  if (planet.techLevel >= 0 && planet.techLevel <= 1) dm -= 2;
  else if (planet.techLevel >= 2 && planet.techLevel <= 3) dm -= 1;
  else if (planet.techLevel >= 4 && planet.techLevel <= 9) dm += 1;

  if (isAgricultural(planet)) dm -= 2;

  if (isIndustrial(planet)) dm += 1;

  if (isNonAgricultural(planet)) dm -= 1;

  if (isRich(planet)) dm += 1;

  return dm;
};

const assignConcentrationRating = (star, planet) => {
  let roll = d6();

  if (roll > planet.population.code) planet.population.concentrationRating = 9;
  else roll += concentrationRatingDMs(planet);

  if (roll <= 0) planet.population.concentrationRating = 0;
  else if (roll >= 9) planet.population.concentrationRating = 9;
  else planet.population.concentrationRating = roll;
};

module.exports = {
  assignConcentrationRating: assignConcentrationRating,
  concentrationRatingDMs: concentrationRatingDMs,
};
