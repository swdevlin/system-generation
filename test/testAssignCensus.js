'use strict';

const chai = require('chai');
const { assignCensus } = require('../population/assignCensus');
const { clearCache, ROLL_CACHE, queueRandomInt } = require('../dice');

chai.should();

describe('assignCensus', function () {
  beforeEach(() => {
    clearCache();
  });

  describe('population.code < 10 (randomInt-driven leading digit)', function () {
    it('combines the leading multiplier and trailing digit for code 5', function () {
      // first randomInt(1,9) call -> leading multiplier, second -> trailing digit
      queueRandomInt(1, 9, 3, 5);
      const population = { code: 5 };
      assignCensus(population);
      population.censusPopulation.should.equal(350_000);
    });

    it('produces the minimum value for code 1 when both rolls are 1', function () {
      queueRandomInt(1, 9, 1, 1);
      const population = { code: 1 };
      assignCensus(population);
      population.censusPopulation.should.equal(11);
    });

    it('produces the maximum value for code 1 when both rolls are 9', function () {
      queueRandomInt(1, 9, 9, 9);
      const population = { code: 1 };
      assignCensus(population);
      population.censusPopulation.should.equal(99);
    });

    it('handles code 0 with a fractional trailing digit', function () {
      queueRandomInt(1, 9, 5, 5);
      const population = { code: 0 };
      assignCensus(population);
      population.censusPopulation.should.equal(5.5);
    });
  });

  describe('significant digits', function () {
    it('has 2 significant digits for code 7 (at or below the 3-digit threshold)', function () {
      queueRandomInt(1, 9, 6, 2);
      const population = { code: 7 };
      assignCensus(population);
      population.censusPopulation.should.equal(62_000_000);
    });

    it('has 3 significant digits for code 8 (at the 3-digit threshold)', function () {
      queueRandomInt(1, 9, 1, 2, 3);
      const population = { code: 8 };
      assignCensus(population);
      population.censusPopulation.should.equal(123_000_000);
    });
  });

  describe('population.code >= 10 (d6-driven leading digit)', function () {
    it('stops immediately when the first roll is 4 or lower, leaving the multiplier at 1', function () {
      ROLL_CACHE.push(1);
      queueRandomInt(1, 9, 4, 6);
      const population = { code: 10 };
      assignCensus(population);
      population.censusPopulation.should.equal(14_600_000_000);
    });

    it('bumps the multiplier by (roll - 4) on each roll above 4, then stops on a roll of 4 or lower', function () {
      ROLL_CACHE.push(5, 1);
      queueRandomInt(1, 9, 3, 2);
      const population = { code: 10 };
      assignCensus(population);
      population.censusPopulation.should.equal(23_200_000_000);
    });

    it('caps the multiplier at 9 after an all-6 streak', function () {
      ROLL_CACHE.push(6, 6, 6, 6, 6);
      queueRandomInt(1, 9, 7, 5);
      const population = { code: 10 };
      assignCensus(population);
      population.censusPopulation.should.equal(97_500_000_000);
      ROLL_CACHE.should.deep.equal([]);
    });
  });

  it('does not mutate population.code', function () {
    queueRandomInt(1, 9, 4, 4);
    const population = { code: 6 };
    assignCensus(population);
    population.code.should.equal(6);
  });
});