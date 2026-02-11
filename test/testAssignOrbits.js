'use strict';

const chai = require('chai');

const Star = require('../stars/star');
const StellarClassification = require('../stars/StellarClassification');
const { ORBIT_TYPES } = require('../utils');

const { clearCache, ROLL_CACHE } = require('../dice');

chai.should();

describe('Orbits', function () {
  beforeEach(() => {
    clearCache();
  });
  // const planetSize = 7;
  // it("assignedOrbits", function() {
  //   const classification = new StellarClassification();
  //   classification.stellarClass = 'V';
  //   classification.stellarType = 'M';
  //   classification.subtype = 5;
  //   const star = new Star(classification, ORBIT_TYPES.PRIMARY);
  //   star.spread = 0.02876757534761693;
  //   star.totalObjects = 7;
  //   star.emptyOrbits = 0;
  //   star.availableOrbits = [
  //     [0.01, 0.10000000000000009],
  //     [4.1, 11.1],
  //     [15.1, 20]
  //   ];
  //   star.markOccupiedOrbits();
  //   star.occupiedOrbits.should.equal([1,2]);
  // });

  it('nextOrbit', function () {
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    const classification = new StellarClassification();
    classification.stellarClass = 'V';
    classification.stellarType = 'M';
    classification.subtype = 5;
    const star = new Star(classification, ORBIT_TYPES.PRIMARY);
    star.spread = 0.02876757534761693;
    star.totalObjects = 7;
    star.emptyOrbits = 0;
    star.availableOrbits = [
      [0.01, 0.10000000000000009],
      [4.1, 11.1],
      [15.1, 20],
    ];
    let nextOrbit = star.nextAvailableOrbit(0);
    nextOrbit.should.be.approximately(0.038, 0.01);

    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    nextOrbit = star.nextAvailableOrbit(4);
    nextOrbit.should.be.approximately(4.1 + star.spread, 0.01);

    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    nextOrbit = star.nextAvailableOrbit(11.09);
    nextOrbit.should.be.approximately(11.09 + star.spread, 0.01);

    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    nextOrbit = star.nextAvailableOrbit(22);
    nextOrbit.should.be.approximately(22 + star.spread, 0.01);
  });
});
