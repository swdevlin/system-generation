'use strict';

const chai = require('chai');
const { recalculateSystemOrbitPositions } = require('../utils/orbitPosition');
const { ORBIT_TYPES } = require('../utils/constants');

chai.should();

describe('recalculateSystemOrbitPositions', function () {
  it('leaves the primary star at the origin and repositions every descendant', function () {
    const primaryStar = {
      orbitType: ORBIT_TYPES.PRIMARY,
      orbit: 0,
      eccentricity: 0,
      inclination: 0,
      orbitPosition: { x: 0, y: 0 },
      hzcoDeviation: 0,
      stellarObjects: [
        {
          orbitType: ORBIT_TYPES.GAS_GIANT,
          orbit: 4,
          eccentricity: 0.1,
          inclination: 8,
          orbitPosition: { x: 0, y: 0 },
          hzcoDeviation: 0,
          moons: [
            {
              orbit: 1.5,
              diameter: 1,
              eccentricity: 0.02,
              inclination: 2,
              orbitPosition: { x: 0, y: 0 },
              hzcoDeviation: 0,
            },
          ],
        },
        {
          orbitType: ORBIT_TYPES.FAR,
          orbit: 15,
          eccentricity: 0.2,
          inclination: 0,
          orbitPosition: { x: 0, y: 0 },
          hzcoDeviation: 0,
          stellarObjects: [
            {
              orbitType: ORBIT_TYPES.TERRESTRIAL,
              orbit: 2,
              eccentricity: 0.03,
              inclination: 4,
              orbitPosition: { x: 0, y: 0 },
              hzcoDeviation: 0,
              moons: [],
            },
          ],
        },
      ],
    };

    const result = recalculateSystemOrbitPositions(primaryStar);

    result.should.equal(primaryStar);
    primaryStar.orbitPosition.should.deep.equal({ x: 0, y: 0 });

    const [gasGiant, farStar] = primaryStar.stellarObjects;
    gasGiant.orbitPosition.should.not.deep.equal({ x: 0, y: 0 });
    gasGiant.orbitPosition3d.should.be.an('object');
    gasGiant.moons[0].orbitPosition.should.not.deep.equal({ x: 0, y: 0 });

    farStar.orbitPosition.should.not.deep.equal({ x: 0, y: 0 });
    farStar.stellarObjects[0].orbitPosition.should.not.deep.equal({ x: 0, y: 0 });
  });

  it('treats missing moons arrays as empty', function () {
    const primaryStar = {
      orbitType: ORBIT_TYPES.PRIMARY,
      orbit: 0,
      eccentricity: 0,
      inclination: 0,
      orbitPosition: { x: 0, y: 0 },
      hzcoDeviation: 0,
      stellarObjects: [
        {
          orbitType: ORBIT_TYPES.PLANETOID_BELT,
          orbit: 5,
          eccentricity: 0,
          inclination: 0,
          orbitPosition: { x: 0, y: 0 },
          hzcoDeviation: 0,
        },
      ],
    };

    (() => recalculateSystemOrbitPositions(primaryStar)).should.not.throw();
  });
});