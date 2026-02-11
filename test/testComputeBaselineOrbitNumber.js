'use strict';

const chai = require('chai');
const { ORBIT_TYPES, computeBaseline } = require('../utils');

const { ROLL_CACHE } = require('../dice');
const computeBaselineOrbitNumber = require('../stars/computeBaselineOrbitNumber');
const Star = require('../stars/star');

chai.should();

describe('compute baseline orbit number', function () {
  afterEach(function () {
    ROLL_CACHE.length = 0;
  });

  describe('The baseline number is between 1 and the system’s total worlds', function () {
    it('hzco >= 1', function () {
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(4);
      const star = new Star(
        { stellarClass: 'V', stellarType: 'K', subtype: 5 },
        ORBIT_TYPES.PRIMARY
      );
      star.baseline = 3;
      star.totalObjects = 12;
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(4);
      const blon = computeBaselineOrbitNumber(star);
      blon.should.equal(star.hzco);
    });

    it('hzco < 1', function () {
      const star = new Star(
        { stellarClass: '', stellarType: 'T', subtype: 5 },
        ORBIT_TYPES.PRIMARY
      );
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(1);
      star.baseline = computeBaseline(star);
      star.totalObjects = 12;
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(4);
      const blon = computeBaselineOrbitNumber(star);
      const expected = star.minimumAllowableOrbit - star.baseline / 10 + (7 - 2) / 100;
      blon.should.equal(expected);
    });
  });
});
