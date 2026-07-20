const { twoD6, d6 } = require('../dice');
const { allocateMajorCityPopulations } = require('./allocateMajorCityPopulations');

const assignMajorCities = (planet) => {
  const pcr = planet.population.concentrationRating;
  const populationCode = planet.population.code;
  const census = planet.population.censusPopulation;
  const urb = planet.population.urbanizationPercentage;

  planet.population.totalUrbanPopulation = census * (urb / 100);

  let majorCities;

  let cityMultiplier = 1;
  if (pcr === 0) {
    majorCities = 0;
  } else if (populationCode <= 5 && pcr === 9) {
    majorCities = 1;
  } else if (populationCode <= 5 && pcr >= 1 && pcr <= 8) {
    majorCities = Math.min(9 - pcr, populationCode);
  } else if (populationCode >= 6 && pcr === 9) {
    majorCities = Math.max(populationCode - twoD6(), 1);
  } else {
    majorCities = Math.max(Math.ceil(twoD6() - pcr + ((urb / 100) * 20) / pcr), 1);
    if (populationCode < 6) majorCities = Math.min(majorCities, populationCode);
    cityMultiplier = pcr / (d6() + 7);
  }

  planet.population.majorCities = majorCities;

  planet.population.majorCityPopulation =
    majorCities === 0
      ? 0
      : Math.floor(planet.population.totalUrbanPopulation * cityMultiplier);
  allocateMajorCityPopulations(planet);
};

module.exports = { assignMajorCities };
