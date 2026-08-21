'use strict';

const chai = require('chai');
const { randomFloat } = require('../dice');

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