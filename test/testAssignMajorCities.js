'use strict';

const chai = require('chai');
const { assignMajorCities } = require('../population/assignMajorCities');
const Population = require('../population/Population');
const { clearCache, ROLL_CACHE } = require('../dice');

chai.should();

// Spec for WBH "Number of Major Cities" (Cases 1-5). Regression coverage for a
// bug where Case 5's formula divided the raw 0-100 urbanizationPercentage by
// pcr without first converting it to a 0-1 fraction, inflating a plausible
// single-digit city count into the hundreds (e.g. 162 cities for a
// population-code-6 world).

describe('assignMajorCities', function () {
  beforeEach(() => {
    clearCache();
  });

  const buildPlanet = ({ pcr, populationCode, urbanizationPercentage, censusPopulation = 1_000_000 } = {}) => {
    const population = new Population();
    population.concentrationRating = pcr;
    population.code = populationCode;
    population.urbanizationPercentage = urbanizationPercentage;
    population.censusPopulation = censusPopulation;
    return { population };
  };

  it('Case 1: PCR 0 -> no major cities', function () {
    const planet = buildPlanet({ pcr: 0, populationCode: 8, urbanizationPercentage: 60 });
    assignMajorCities(planet);
    planet.population.majorCities.should.equal(0);
  });

  it('Case 2: population code <= 5 and PCR 9 -> exactly one major city', function () {
    const planet = buildPlanet({ pcr: 9, populationCode: 4, urbanizationPercentage: 60 });
    assignMajorCities(planet);
    planet.population.majorCities.should.equal(1);
  });

  it('Case 3: population code <= 5, PCR 1-8 -> min(9 - PCR, population code)', function () {
    const planet = buildPlanet({ pcr: 4, populationCode: 3, urbanizationPercentage: 60 });
    assignMajorCities(planet);
    planet.population.majorCities.should.equal(3); // min(9-4=5, 3) = 3
  });

  it('Case 4: population code >= 6 and PCR 9 -> max(population code - 2D, 1)', function () {
    // twoD6() = 2 + 3 = 5; max(8 - 5, 1) = 3
    ROLL_CACHE.push(2, 3);
    const planet = buildPlanet({ pcr: 9, populationCode: 8, urbanizationPercentage: 60 });
    assignMajorCities(planet);
    planet.population.majorCities.should.equal(3);
  });

  describe('Case 5: population code >= 6, PCR 1-8', function () {
    it('matches the WBH-worked Zed Prime example (PCR 3, 39% urbanization, roll 7 -> 7 cities)', function () {
      // twoD6() = 3 + 4 = 7; ceil(7 - 3 + (39/100)*(20/3)) = ceil(4 + 2.6) = 7
      ROLL_CACHE.push(3, 4, 2); // last roll feeds cityMultiplier's d6(), value irrelevant here
      const planet = buildPlanet({ pcr: 3, populationCode: 8, urbanizationPercentage: 39 });
      assignMajorCities(planet);
      planet.population.majorCities.should.equal(7);
    });

    it('does not inflate the city count from urbanizationPercentage being a 0-100 value (regression)', function () {
      // twoD6() = 3 + 4 = 7; ceil(7 - 5 + (50/100)*(20/5)) = ceil(2 + 2) = 4
      // Previously (bug): ceil(7 - 5 + 50*20/5) = ceil(2 + 200) = 202
      ROLL_CACHE.push(3, 4, 2);
      const planet = buildPlanet({ pcr: 5, populationCode: 8, urbanizationPercentage: 50 });
      assignMajorCities(planet);
      planet.population.majorCities.should.equal(4);
    });
  });
});