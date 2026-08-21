'use strict';

const chai = require('chai');

const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { clearCache, ROLL_CACHE } = require('../dice');
const TechLevelGenerator = require('../techLevel/TechLevelGenerator');

chai.should();

describe('TechLevelGenerator.subTL', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    planet.atmosphere.code = 6;
    planet.hydrographics.code = 6;
  });

  it('raises the result to environmentMinTechLevel - 2 when that exceeds the natural lower bound', function () {
    planet.atmosphere.code = 0; // chart: 8 -> floor 6
    TechLevelGenerator.subTL(1, 20, 0, planet).should.equal(6);
  });

  it('leaves the natural lower bound alone when it already exceeds the environmental floor', function () {
    planet.atmosphere.code = 0; // chart: 8 -> floor 6
    TechLevelGenerator.subTL(1, 20, 10, planet).should.equal(10);
  });

  it('still respects the upper bound even when the environmental floor would exceed it', function () {
    planet.atmosphere.code = 16; // chart: 14 -> floor 12
    TechLevelGenerator.subTL(1, 5, 0, planet).should.equal(5);
  });

  it('has no effect when the environment requires no minimum', function () {
    planet.atmosphere.code = 6; // no chart entry, neutral habitability
    TechLevelGenerator.subTL(1, 20, 3, planet).should.equal(3);
  });

  it('has no effect on native sophonts even in a harsh environment', function () {
    planet.atmosphere.code = 0;
    planet.nativeSophont = true;
    TechLevelGenerator.subTL(1, 20, 3, planet).should.equal(3);
  });
});

describe('TechLevelGenerator.lowCommonTechLevel', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    planet.atmosphere.code = 6;
    planet.hydrographics.code = 6;
    planet.techLevel.code = 16;
    planet.population.code = 10; // >= 9 -> -1
    planet.government.code = 7; // -2
    planet.population.concentrationRating = 1; // <= 2 -> -1
  });

  it('is unaffected in a benign environment', function () {
    ROLL_CACHE.push(1, 1); // twoD6 = 2 -> techLevelModifiers() = -3
    // tl = 16 - 3 - 1 - 1 - 2 = 9; code/2 floor is 8, environment floor is -2: neither binds
    TechLevelGenerator.lowCommonTechLevel(planet).should.equal(9);
  });

  it('is raised to environmentMinTechLevel - 2 in a harsh environment', function () {
    planet.atmosphere.code = 16; // chart: 14 -> floor 12, above both tl (9) and code/2 (8)
    ROLL_CACHE.push(1, 1);
    TechLevelGenerator.lowCommonTechLevel(planet).should.equal(12);
  });
});