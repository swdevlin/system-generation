'use strict';

const chai = require('chai');

const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { clearCache, ROLL_CACHE } = require('../dice');
const TechLevelGenerator = require('../techLevel/TechLevelGenerator');

chai.should();

describe('TechLevelGenerator.airTransport', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    planet.atmosphere.code = 6;
    planet.hydrographics.code = 6;
    planet.techLevel.energy = 8;
    planet.techLevel.electronics = 6;
  });

  it('is automatically 0 when atmosphere is 0 and TL is 5 or lower', function () {
    planet.atmosphere.code = 0;
    planet.techLevel.code = 5;
    TechLevelGenerator.airTransport(planet);
    planet.techLevel.airTransport.should.equal(0);
  });

  it('applies a -2 DM for atmosphere 0-3 or E at TL 7 or lower', function () {
    planet.atmosphere.code = 2;
    planet.techLevel.code = 7;
    ROLL_CACHE.push(3, 4); // twoD6 = 7 -> techLevelModifiers() = 0
    TechLevelGenerator.airTransport(planet);
    planet.techLevel.airTransport.should.equal(6); // energy(8) + 0 - 2
  });

  it('applies a -1 DM for atmosphere 4 or 5 at TL 7 or lower', function () {
    planet.atmosphere.code = 4;
    planet.techLevel.code = 7;
    ROLL_CACHE.push(3, 4);
    TechLevelGenerator.airTransport(planet);
    planet.techLevel.airTransport.should.equal(7); // energy(8) + 0 - 1
  });

  it('applies a +1 DM for atmosphere 4 or 5 at TL 8 or higher', function () {
    planet.atmosphere.code = 5;
    planet.techLevel.code = 8;
    ROLL_CACHE.push(3, 4);
    TechLevelGenerator.airTransport(planet);
    planet.techLevel.airTransport.should.equal(8); // energy(8) + 0 + 1, capped at energy
  });

  it('is clamped between electronics - 5 and energy', function () {
    planet.atmosphere.code = 6; // neutral, no DM
    planet.techLevel.code = 10;
    planet.techLevel.energy = 3;
    planet.techLevel.electronics = 20; // lower bound would be 15, above the upper bound
    ROLL_CACHE.push(1, 1); // techLevelModifiers() = -3
    TechLevelGenerator.airTransport(planet);
    planet.techLevel.airTransport.should.equal(3); // upper bound (energy) wins
  });
});