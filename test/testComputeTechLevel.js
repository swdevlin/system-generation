'use strict';

const chai = require('chai');

const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { clearCache, queueRandomInt } = require('../dice');
const TechLevelGenerator = require('../techLevel/TechLevelGenerator');
const Star = require('../stars/star');
const { ORBIT_TYPES } = require('../utils');

chai.should();

describe('TechLevelGenerator.computeTechLevel', function () {
  let planet;
  let warnings;
  let originalWarn;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    // page 172 -- the DM is 0 for these values, so naturalMin/naturalMax are 1/6 unmodified
    planet.atmosphere.code = 6;
    planet.hydrographics.code = 6;
    planet.population.code = 6;
    planet.government.code = 6;

    warnings = [];
    originalWarn = console.warn;
    console.warn = (message) => warnings.push(message);
  });

  afterEach(() => {
    console.warn = originalWarn;
  });

  it('floors a low roll to the environment minimum', function () {
    planet.atmosphere.code = 0; // chart: 8; dm = +1 (atmosphere <= 3) -> naturalMax = 7 < 8
    TechLevelGenerator.computeTechLevel(planet);
    planet.techLevel.code.should.equal(8);
    planet.techLevel.floorExceededCeiling.should.equal(true);
    warnings.length.should.equal(1);
  });

  it('does not floor a native sophont planet', function () {
    planet.atmosphere.code = 0; // also +1 DM (atmosphere <= 3), separate from the chart
    planet.nativeSophont = true;
    queueRandomInt(2, 7, 2); // naturalMin = 2, naturalMax = 7 (env chart is bypassed)
    TechLevelGenerator.computeTechLevel(planet);
    planet.techLevel.code.should.equal(2);
    planet.techLevel.floorExceededCeiling.should.equal(false);
    warnings.length.should.equal(0);
  });

  it('samples within the natural range when no floor binds', function () {
    queueRandomInt(1, 6, 6); // naturalMin = 1, naturalMax = 6
    TechLevelGenerator.computeTechLevel(planet);
    planet.techLevel.code.should.equal(6);
    planet.techLevel.floorExceededCeiling.should.equal(false);
  });

  it('applies a provided min above the environment floor', function () {
    TechLevelGenerator.computeTechLevel(planet, { min: 11 });
    planet.techLevel.code.should.equal(11); // naturalMax = 6 < 11 -> collapses to the min
    planet.techLevel.floorExceededCeiling.should.equal(true);
    warnings.length.should.equal(1);
  });

  it('applies a provided max by narrowing the sampled range, not pinning a single value', function () {
    // naturalMin = 1, naturalMax = 6; the roll is drawn from the natural window and
    // rescaled onto the [1, 2] band: offset = round(((6-1)/5) * (2-1)) = 1 -> code = 2
    queueRandomInt(1, 6, 6);
    TechLevelGenerator.computeTechLevel(planet, { max: 2 });
    planet.techLevel.code.should.equal(2);
    planet.techLevel.floorExceededCeiling.should.equal(false);
  });

  it('rescales the roll across a band that sits entirely above the natural window', function () {
    // dm = 0, so naturalMin = 1, naturalMax = 6. A band of { min: 9, max: 12 } sits
    // entirely above the natural window; the fix rescales the roll's position within
    // the natural window onto the band instead of collapsing to min.
    queueRandomInt(1, 6, 1); // lowest natural roll -> band floor
    TechLevelGenerator.computeTechLevel(planet, { min: 9, max: 12 });
    planet.techLevel.code.should.equal(9);
    planet.techLevel.floorExceededCeiling.should.equal(false);
    warnings.length.should.equal(0);
  });

  it('rescales a high roll to the top of a band above the natural window', function () {
    queueRandomInt(1, 6, 6); // highest natural roll -> band ceiling
    TechLevelGenerator.computeTechLevel(planet, { min: 9, max: 12 });
    planet.techLevel.code.should.equal(12);
    planet.techLevel.floorExceededCeiling.should.equal(false);
  });

  it('rescales a mid roll to a mid point of a band above the natural window, not the floor', function () {
    // offset = round(((3-1)/5) * (12-9)) = round(1.2) = 1 -> code = 10
    queueRandomInt(1, 6, 3);
    TechLevelGenerator.computeTechLevel(planet, { min: 9, max: 12 });
    planet.techLevel.code.should.equal(10);
    planet.techLevel.floorExceededCeiling.should.equal(false);
  });

  it('lets the environment floor override a lower max, logging the conflict', function () {
    planet.atmosphere.code = 0; // chart: 8; dm = +1 -> naturalMax = 7
    TechLevelGenerator.computeTechLevel(planet, { max: 5 });
    planet.techLevel.code.should.equal(8); // the floor wins over a max that can't satisfy it
    planet.techLevel.floorExceededCeiling.should.equal(true);
    warnings.length.should.equal(1);
  });

  it('records the DMs, bounds, and environment minimum used to compute the result', function () {
    planet.atmosphere.code = 0; // chart: 8; dm = +1
    TechLevelGenerator.computeTechLevel(planet, { min: 2, max: 20 });
    planet.techLevel.dm.should.equal(1);
    planet.techLevel.environmentMinTechLevel.should.equal(8);
    planet.techLevel.min.should.equal(2);
    planet.techLevel.max.should.equal(20);
  });

  it('records null min/max when no bounds are provided', function () {
    TechLevelGenerator.computeTechLevel(planet);
    (planet.techLevel.min === null).should.equal(true);
    (planet.techLevel.max === null).should.equal(true);
  });
});

describe('TechLevelGenerator.computeNativeTechLevel', function () {
  let planet;
  let star;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    star = new Star({ stellarClass: 'V', stellarType: 'K', subtype: 5 }, ORBIT_TYPES.PRIMARY);
    star.age = 1.5;
  });

  it('defaults to a 1-15 range', function () {
    TechLevelGenerator.computeNativeTechLevel(star, planet);
    planet.techLevel.code.should.be.at.least(1);
    planet.techLevel.code.should.be.at.most(15);
    planet.techLevel.min.should.equal(1);
    planet.techLevel.max.should.equal(15);
  });

  it('applies a provided min and max', function () {
    TechLevelGenerator.computeNativeTechLevel(star, planet, { min: 9, max: 9 });
    planet.techLevel.code.should.equal(9);
    planet.techLevel.min.should.equal(9);
    planet.techLevel.max.should.equal(9);
  });

  it('never consults the environment chart', function () {
    planet.atmosphere.code = 0; // would otherwise require TL 8
    TechLevelGenerator.computeNativeTechLevel(star, planet, { min: 0, max: 0 });
    planet.techLevel.code.should.equal(0);
  });

  it('records the DM used to compute the result', function () {
    planet.government.code = 5; // +1
    planet.population.code = 8; // +1
    star.age = 4; // +2
    TechLevelGenerator.computeNativeTechLevel(star, planet);
    planet.techLevel.dm.should.equal(4);
  });
});