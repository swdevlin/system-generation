'use strict';

const chai = require('chai');
const { starEccentricity } = require('../stars/starEccentricity');
const { clearCache, ROLL_CACHE } = require('../dice');

chai.should();

describe('starEccentricity', function () {
  beforeEach(() => {
    clearCache();
  });

  it('applies the +2 baseline that only stars get', function () {
    ROLL_CACHE.push(3, 3); // twoD6() = 6 -> roll = 6 + 2 = 8 -> [0.04, 0.09) band
    starEccentricity().should.be.within(0.04, 0.09);
  });
});
