'use strict';

const chai = require('chai');
const {
  allocateMajorCityPopulations,
  resolveDuplicateMajorCityPopulations,
} = require('../population/allocateMajorCityPopulations');
const Population = require('../population/Population');
const { clearCache, ROLL_CACHE, queueRandomInt } = require('../dice');

chai.should();

// TDD spec for WBH p.153 "Major City Population" (Cases 1-4). The function does
// not exist yet -- these tests define the contract to implement against.
//
// Contract:
//   allocateMajorCityPopulations(planet) mutates planet in place, setting
//   planet.population.majorCityPopulations to an array of city population
//   numbers, in the order allocated (no automatic reordering -- WBH step 10
//   "reorder cities from largest to smallest" is an optional Referee
//   flourish, not part of this deterministic allocation). Step 11 "add
//   variance to identical cities" IS enforced: whenever two entries end up
//   with the same population, a random 5-10% of one is transferred to the
//   other (repeated until no two entries match).
//
//   Inputs read from planet:
//     planet.population.totalUrbanPopulation - used only by Case 1 (PCR 0)
//     planet.population.concentrationRating  - PCR, selects the case
//     planet.population.majorCities          - city count, selects the case
//     planet.population.majorCityPopulation  - "Total Major City Population"
//                                               pool for Cases 2/3/4 (already
//                                               computed by assignMajorCities)
//
//   All "1D" rolls are plain d6() (cacheable via ROLL_CACHE).
//
// ASSUMPTION (flagged, unconfirmed): WBH's Case 3 formula
//   "((1D + 3) x 10% +/- variance) x Total Major City Population"
// does not define "variance" in the pasted excerpt. These tests assume
// variance = fluxRoll() (the existing 1D-1D utility in dice.js), applied as
// a straight +/- percentage-point adjustment to the (1D+3)*10 base percent.
// If the book's actual variance sub-rule differs, only the Case 3 tests
// below need to change -- Cases 1, 2, and 4 do not depend on this assumption.
//
// UNTESTED GAP: Case 4 step 3's chunk-size-percent has a fallback ("if PCR
// alone would yield fewer than 2x-major-cities chunks, shrink the chunk size
// to remaining/(2*cities) instead") that WBH illustrates only in the
// abstract (9 cities, remaining 91%, chunk size 5%), never against full
// dice rolls with a leftover percentage to place. The one worked example we
// have (Zed Prime, below) has a leftover of exactly 0, so it doesn't
// exercise "assign the leftover to the city that would have received one
// more chunk." That branch is intentionally left untested here pending
// clarification.

describe('allocateMajorCityPopulations', function () {
  beforeEach(() => {
    clearCache();
  });

  const buildPlanet = ({ pcr, majorCities, majorCityPopulation, totalUrbanPopulation } = {}) => {
    const population = new Population();
    population.concentrationRating = pcr;
    population.majorCities = majorCities;
    population.majorCityPopulation = majorCityPopulation;
    population.totalUrbanPopulation = totalUrbanPopulation;
    return { population };
  };

  describe('Case 1: PCR 0 (no major cities -- single "largest city" figure)', function () {
    it('uses 1D+2 x 10,000 when it is less than total urban population / 100', function () {
      // totalUrbanPopulation/100 = 100,000; (1D+2)*10,000 with d6=5 -> 70,000 (smaller, wins)
      ROLL_CACHE.push(5);
      const planet = buildPlanet({ pcr: 0, majorCities: 0, totalUrbanPopulation: 10_000_000 });
      allocateMajorCityPopulations(planet);
      planet.population.majorCityPopulations.should.deep.equal([70_000]);
    });

    it('uses total urban population / 100 when it is less than 1D+2 x 10,000', function () {
      // totalUrbanPopulation/100 = 5,000; (1D+2)*10,000 with d6=6 -> 80,000 (larger, loses)
      ROLL_CACHE.push(6);
      const planet = buildPlanet({ pcr: 0, majorCities: 0, totalUrbanPopulation: 500_000 });
      allocateMajorCityPopulations(planet);
      planet.population.majorCityPopulations.should.deep.equal([5_000]);
    });

    it('falls back to max(total urban population / 10, 1D+1) when the result is below 100', function () {
      // totalUrbanPopulation/100 = 50; (1D+2)*10,000 with d6=1 -> 30,000; min(50, 30,000) = 50 < 100
      // fallback: max(totalUrbanPopulation/10 = 500, 1D+1 with d6=2 -> 3) = 500
      ROLL_CACHE.push(1, 2);
      const planet = buildPlanet({ pcr: 0, majorCities: 0, totalUrbanPopulation: 5_000 });
      allocateMajorCityPopulations(planet);
      planet.population.majorCityPopulations.should.deep.equal([500]);
    });
  });

  describe('Case 2: exactly one major city', function () {
    it('gives the single city the entire Total Major City Population', function () {
      const planet = buildPlanet({ pcr: 5, majorCities: 1, majorCityPopulation: 850_000 });
      allocateMajorCityPopulations(planet);
      planet.population.majorCityPopulations.should.deep.equal([850_000]);
    });

    it('rolls no dice for a single city', function () {
      const planet = buildPlanet({ pcr: 5, majorCities: 1, majorCityPopulation: 850_000 });
      allocateMajorCityPopulations(planet);
      ROLL_CACHE.should.deep.equal([]);
    });
  });

  describe('Case 3: PCR 1-8, two or three major cities', function () {
    it('allocates two cities, giving any leftover after both rolls to the first city', function () {
      // city1: (1D=4 -> 70%) + flux(1D=6, 1D=4 -> +2) = 72% of 1,000,000 = 720,000; remaining 280,000
      // city2: (1D=3 -> 60%) + flux(1D=5, 1D=5 -> 0) = 60% of 280,000 = 168,000; leftover 112,000 -> city1
      ROLL_CACHE.push(4, 6, 4, 3, 5, 5);
      const planet = buildPlanet({ pcr: 4, majorCities: 2, majorCityPopulation: 1_000_000 });
      allocateMajorCityPopulations(planet);
      planet.population.majorCityPopulations.should.deep.equal([832_000, 168_000]);
    });

    it('allocates three cities, giving any final leftover to the first city', function () {
      // city1: (1D=5 -> 80%) + flux(1D=4, 1D=4 -> 0) = 80% of 1,000,000 = 800,000; remaining 200,000
      // city2: (1D=2 -> 50%) + flux(1D=3, 1D=3 -> 0) = 50% of 200,000 = 100,000; remaining 100,000
      // city3: (1D=1 -> 40%) + flux(1D=6, 1D=2 -> +4) = 44% of 100,000 = 44,000; leftover 56,000 -> city1
      ROLL_CACHE.push(5, 4, 4, 2, 3, 3, 1, 6, 2);
      const planet = buildPlanet({ pcr: 4, majorCities: 3, majorCityPopulation: 1_000_000 });
      allocateMajorCityPopulations(planet);
      planet.population.majorCityPopulations.should.deep.equal([856_000, 100_000, 44_000]);
    });
  });

  describe('Case 4: PCR 1-8, four or more major cities', function () {
    it('matches the WBH-worked Zed Prime example (PCR 3, 7 major cities)', function () {
      // Total Major City Population given directly (already computed by assignMajorCities): 2,100,000
      // remaining = 100 - 7 = 93; chunk size = PCR = 3 (93/3 = 31 chunks, already >= 2*7=14 minimum, no adjustment)
      // Round 1 (one 1D roll per city, in order): 2, 4, 2, 3, 1, 2, 6  (20 of 31 chunks used)
      // Round 2 (cycle back to city 1): 3, 4, 3, 4 -- last roll capped from 4 to 1 (only 1 chunk left)
      // chunks per city: 5, 8, 5, 4, 1, 2, 6 (31 total, 0 leftover percent)
      // percent per city: 1 + chunks*3 = 16%, 25%, 16%, 13%, 4%, 7%, 19% (sums to 100%)
      // 1% of 2,100,000 = 21,000 people
      // city1 and city3 both come out to 336,000 -- the duplicate-resolution
      // step kicks in: with randomInt(5,10) -> 8%, 8% of city3's 336,000
      // (26,880) moves from city3 to city1.
      ROLL_CACHE.push(2, 4, 2, 3, 1, 2, 6, 3, 4, 3, 4);
      queueRandomInt(5, 10, 8);
      const planet = buildPlanet({ pcr: 3, majorCities: 7, majorCityPopulation: 2_100_000 });
      allocateMajorCityPopulations(planet);
      planet.population.majorCityPopulations.should.deep.equal([
        362_880, 525_000, 309_120, 273_000, 84_000, 147_000, 399_000,
      ]);
    });

    it('consumes exactly the expected number of dice for the Zed Prime example', function () {
      ROLL_CACHE.push(2, 4, 2, 3, 1, 2, 6, 3, 4, 3, 4, 42);
      const planet = buildPlanet({ pcr: 3, majorCities: 7, majorCityPopulation: 2_100_000 });
      allocateMajorCityPopulations(planet);
      ROLL_CACHE.should.deep.equal([42]);
    });
  });

  describe('duplicate-population resolution (WBH step 11)', function () {
    it('leaves distinct populations untouched', function () {
      const populations = [500_000, 300_000, 200_000];
      resolveDuplicateMajorCityPopulations(populations);
      populations.should.deep.equal([500_000, 300_000, 200_000]);
    });

    it('moves a random 5-10% from the later duplicate to the earlier one', function () {
      queueRandomInt(5, 10, 7);
      const populations = [200_000, 200_000];
      resolveDuplicateMajorCityPopulations(populations);
      // 7% of 200,000 = 14,000 moves from index 1 to index 0
      populations.should.deep.equal([214_000, 186_000]);
    });

    it('repeats until no two entries match, when a fix creates a new collision', function () {
      // index0 and index1 tie first: 7% of 100,000 = 7,000 moves 1 -> 0,
      // leaving [107_000, 93_000, 93_000] -- now index1/index2 tie, so a
      // second pass fires: 5% of 93,000 = 4,650 moves 2 -> 1.
      queueRandomInt(5, 10, 7, 5);
      const populations = [100_000, 100_000, 93_000];
      resolveDuplicateMajorCityPopulations(populations);
      populations.should.deep.equal([107_000, 97_650, 88_350]);
    });

    it('does not touch matching zero-population entries (nothing to redistribute)', function () {
      const populations = [0, 0];
      resolveDuplicateMajorCityPopulations(populations);
      populations.should.deep.equal([0, 0]);
    });
  });
});
