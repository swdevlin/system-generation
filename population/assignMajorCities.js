const { twoD6, d6 } = require('../dice');

const assignMajorCities = (planet) => {
  const pcr = planet.population.concentrationRating;
  const pop = planet.population.code;
  const urb = planet.population.urbanizationPercentage;

  let majorCities;

  if (pcr === 0) {
    // Case 1: no large cities
    majorCities = 0;
  } else if (pop <= 5 && pcr === 9) {
    // Case 2: single concentrated city
    majorCities = 1;
  } else if (pop <= 5) {
    // Case 3: pop <= 5, PCR 1-8
    majorCities = Math.min(9 - pcr, pop);
  } else if (pcr === 9) {
    // Case 4: pop >= 6, PCR 9
    majorCities = Math.max(pop - twoD6(), 1);
  } else {
    // Case 5: pop >= 6, PCR 1-8
    majorCities = Math.max(Math.ceil(twoD6() - pcr + urb / (pcr * 5)), 1);
    if (pop < 6) majorCities = Math.min(majorCities, pop);
  }

  planet.population.majorCities = majorCities;

  const totalUrbanPopulation = Math.pow(10, pop) * (urb / 100);
  planet.population.majorCityPopulation = Math.ceil(
    (pcr / (d6() + 7)) * totalUrbanPopulation
  );
};

module.exports = { assignMajorCities };
