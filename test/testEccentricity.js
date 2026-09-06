'use strict';

const chai = require('chai');
const eccentricity = require('../utils/eccentricity');
const { clearCache, ROLL_CACHE, queueRandomInt } = require('../dice');

chai.should();

describe('eccentricity', function () {
  beforeEach(() => {
    clearCache();
  });

  it('rolls into the top band without the low flag', function () {
    ROLL_CACHE.push(6, 6); // twoD6() = 12 -> roll = 12 + 0 = 12, top band (>11)
    eccentricity(0).should.be.within(0.4, 0.9);
  });

  it('picks the upper low band when the weighted pick favors it', function () {
    queueRandomInt(1, 30, 30); // top of the range -> roll = 9 -> band 3
    eccentricity(0, true).should.be.within(0.04, 0.09);
  });

  it('picks the lower low band when the weighted pick favors it', function () {
    queueRandomInt(1, 30, 1); // bottom of the range -> roll = 2 -> band 1
    eccentricity(0, true).should.be.within(0.0, 0.005);
  });

  it('never exceeds 0.09 across many low-flagged samples', function () {
    for (let i = 0; i < 200; i++) {
      eccentricity(0, true).should.be.at.most(0.09);
    }
  });
});
