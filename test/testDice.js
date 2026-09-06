'use strict';

const chai = require('chai');
const { randomFloat, twoD6InRange, clearCache, queueRandomInt } = require('../dice');

chai.should();

describe('randomFloat', function () {
  it('respects the given bounds', function () {
    for (let i = 0; i < 100; i++) {
      const value = randomFloat(0, Math.PI * 2);
      value.should.be.at.least(0);
      value.should.be.below(Math.PI * 2);
    }
  });
});

describe('twoD6InRange', function () {
  beforeEach(() => {
    clearCache();
  });

  it('never returns a value outside the requested range', function () {
    for (let i = 0; i < 300; i++) {
      twoD6InRange(4, 9).should.be.within(4, 9);
    }
  });

  it('never returns a value outside natural 2d6 bounds when the range is wider', function () {
    for (let i = 0; i < 300; i++) {
      twoD6InRange(-5, 20).should.be.within(2, 12);
    }
  });

  it('picks the low end of the range on the lowest weighted pick', function () {
    queueRandomInt(1, 21, 1); // weight-1 slot -> sum = 2
    twoD6InRange(2, 7).should.equal(2);
  });

  it('picks the high end of the range on the highest weighted pick', function () {
    queueRandomInt(1, 21, 21); // last weight-6 slot -> sum = 7
    twoD6InRange(2, 7).should.equal(7);
  });

  it('returns a single value when min equals max', function () {
    twoD6InRange(8, 8).should.equal(8);
  });

  it('falls back to a clamped value when the range does not overlap 2-12', function () {
    twoD6InRange(15, 20).should.be.within(15, 20);
  });
});