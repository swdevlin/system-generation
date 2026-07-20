const { fluxRoll, d6, randomInt } = require('../dice');

const resolveDuplicateMajorCityPopulations = (populations) => {
  let hasDuplicate = true;
  while (hasDuplicate) {
    hasDuplicate = false;
    for (let i = 0; i < populations.length; i++) {
      for (let j = i + 1; j < populations.length; j++) {
        if (populations[i] === populations[j] && populations[i] > 0) {
          const pct = randomInt(5, 10) / 100;
          const amount = Math.max(1, Math.floor(populations[j] * pct));
          populations[i] += amount;
          populations[j] -= amount;
          hasDuplicate = true;
        }
      }
    }
  }
};

const allocateMajorCityPopulations = (planet) => {
  let majorCities = planet.population.majorCities;
  let pcr = planet.population.concentrationRating;
  let totalMajorCityPopulation = planet.population.majorCityPopulation;
  let p, m;
  planet.population.majorCityPopulations = [];
  if (pcr === 0) {
    p = Math.min(planet.population.totalUrbanPopulation / 100, (d6() + 2) * 10000);
    if (p < 100) p = Math.max(planet.population.totalUrbanPopulation / 10, d6() + 1);
    planet.population.majorCityPopulations[0] = Math.floor(p);
  } else {
    if (majorCities === 1) planet.population.majorCityPopulations[0] = totalMajorCityPopulation;
    else if (majorCities <= 3 && pcr >= 1 && pcr <= 8) {
      let remaining = totalMajorCityPopulation;
      for (let i = 0; i < majorCities; i++) {
        m = (d6() + 3) * 10 + fluxRoll();
        p = (remaining * m) / 100;
        if (p / remaining < 0.01) p = remaining * 0.01;
        p = Math.floor(p);
        planet.population.majorCityPopulations.push(p);
        remaining = Math.max(remaining - p, 0);
      }
      planet.population.majorCityPopulations[0] += remaining;
    } else {
      let percents = Array(majorCities).fill(0);
      let remainingPercent = 100 - majorCities;
      let chunkCount = Math.max(2 * majorCities, remainingPercent / pcr);
      let i;
      for (i = 0; i < majorCities && chunkCount > 0; i++) {
        let c = Math.min(chunkCount, d6());
        percents[i] += c;
        chunkCount -= c;
      }
      if (chunkCount > 0)
        for (i = 0; i < majorCities && chunkCount > 0; i++) {
          let c = Math.min(chunkCount, d6());
          percents[i] += c;
          chunkCount -= c;
        }
      percents = percents.map((pct) => pct * pcr + 1);

      planet.population.majorCityPopulations.push(
        ...percents.map((pct) => Math.floor((totalMajorCityPopulation * pct) / 100))
      );
    }
  }
  resolveDuplicateMajorCityPopulations(planet.population.majorCityPopulations);
};

module.exports = {
  allocateMajorCityPopulations,
  resolveDuplicateMajorCityPopulations,
};
