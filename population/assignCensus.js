const { randomInt, d6 } = require('../dice');

const assignCensus = (population) => {
  let p;
  if (population.code >= 10) {
    p = 1;
    let r = d6();
    while (p < 9 && r > 4) {
      p += r - 4;
      r = d6();
    }
  } else p = randomInt(1, 9);

  population.censusPopulation = 10 ** population.code * p;
  population.censusPopulation += 10 ** (population.code - 1) * randomInt(1, 9);
  if (population.code > 7)
    population.censusPopulation += 10 ** (population.code - 2) * randomInt(1, 9);
};

module.exports = {
  assignCensus,
};
