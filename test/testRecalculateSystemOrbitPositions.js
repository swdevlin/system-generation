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
              diameter: 1,
              moons: [
                {
                  orbit: 1.5,
                  diameter: 0.2,
                  eccentricity: 0,
                  inclination: 0,
                  orbitPosition: { x: 0, y: 0 },
                  hzcoDeviation: 0,
                },
              ],
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

    const companionPlanet = farStar.stellarObjects[0];
    companionPlanet.orbitPosition.should.not.deep.equal({ x: 0, y: 0 });

    // The planet orbits farStar (at ~2500 AU from the primary), not the
    // primary itself, so its position must land close to farStar's,
    // not near the origin where it would sit if it were (wrongly)
    // offset by the primary star's position instead.
    const distanceFromFarStar = Math.hypot(
      companionPlanet.orbitPosition.x - farStar.orbitPosition.x,
      companionPlanet.orbitPosition.y - farStar.orbitPosition.y,
    );
    const distanceFromOrigin = Math.hypot(companionPlanet.orbitPosition.x, companionPlanet.orbitPosition.y);
    distanceFromFarStar.should.be.lessThan(distanceFromOrigin);

    // The companion planet's moon must be offset from the planet, not
    // from the primary star or farStar.
    const moon = companionPlanet.moons[0];
    moon.orbitPosition.should.not.deep.equal({ x: 0, y: 0 });
    const moonDistanceFromPlanet = Math.hypot(
      moon.orbitPosition.x - companionPlanet.orbitPosition.x,
      moon.orbitPosition.y - companionPlanet.orbitPosition.y,
    );
    const moonDistanceFromOrigin = Math.hypot(moon.orbitPosition.x, moon.orbitPosition.y);
    moonDistanceFromPlanet.should.be.lessThan(moonDistanceFromOrigin);
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