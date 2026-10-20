'use strict';

const chai = require('chai');
const assignTidalLock = require('../tidalLock/assignTidalLock');
const { ORBIT_TYPES } = require('../utils');
const { clearCache, ROLL_CACHE } = require('../dice');

chai.should();

describe('assignTidalLock planet-to-moon eligibility', function () {
  beforeEach(() => {
    clearCache();
  });

  it('does not let an unlocked moon make the planet lock to it', function () {
    const moon = {
      size: 1,
      eccentricity: 0,
      axialTilt: 90, // pushes moon's own common DMs very negative, forcing a real roll
      orbit: 2,
      period: 50,
      tidalLock: null,
      tidalLockTarget: null,
      buildLog: [],
    };

    const planet = {
      orbitType: ORBIT_TYPES.TERRESTRIAL,
      orbit: 10,
      eccentricity: 0,
      axialTilt: 0,
      size: 0,
      atmosphere: { code: 7 },
      mass: 0.5,
      moons: [moon],
      tidalLock: null,
      tidalLockTarget: null,
      buildLog: [],
    };

    const star = { mass: 1, age: 3, stellarObjects: [planet] };

    // Moon's moonToPlanetCase total DM is -3 here; raw roll of 12 (two 6s) lands on total 9 -> 'retrograde',
    // a partial tidal effect, not a 3:2/1:1 lock. The d6() roll inside that branch consumes one more value.
    ROLL_CACHE.push(6, 6, 4);

    assignTidalLock([star]);

    moon.tidalLock.should.equal('retrograde');
    // The planet's own planet-to-star case auto-fails (DM well below -10); since the moon
    // never resolved to a 3:2/1:1 lock, the planet must not be swayed by a planet-to-moon case.
    (planet.tidalLock === null).should.equal(true);
  });

  it('lets the planet lock to a moon once that moon is confirmed locked to it', function () {
    const moon = {
      size: 1,
      eccentricity: 0,
      axialTilt: 0,
      orbit: 2,
      period: 50,
      tidalLock: null,
      tidalLockTarget: null,
      buildLog: [],
    };

    const planet = {
      orbitType: ORBIT_TYPES.TERRESTRIAL,
      orbit: 10,
      eccentricity: 0,
      axialTilt: 0,
      size: 0,
      atmosphere: { code: 7 },
      mass: 1500, // parent mass >= 1000 -> DM+8, auto-succeeding the moon's lock to this planet
      moons: [moon],
      tidalLock: null,
      tidalLockTarget: null,
      buildLog: [],
    };

    const star = { mass: 1, age: 3, stellarObjects: [planet] };

    // Moon: auto-succeed (DM 15) -> confirmation roll of 5 (not natural 12) -> 1:1 lock to planet.
    // Planet: auto-succeed planet-to-moon case (DM 11, beats the planet-to-star case's DM of -26)
    // -> confirmation roll of 5 (not natural 12) -> 1:1 lock to the moon.
    ROLL_CACHE.push(2, 3, 1, 4);

    assignTidalLock([star]);

    moon.tidalLock.should.equal('1:1');
    moon.tidalLockTarget.should.equal(planet);
    planet.tidalLock.should.equal('1:1');
    planet.tidalLockTarget.should.equal(moon);
    planet.rotation.should.equal(50 * 24);
  });
});
