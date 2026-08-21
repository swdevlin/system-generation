'use strict';

const chai = require('chai');

const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { clearCache } = require('../dice');
const TechLevelGenerator = require('../techLevel/TechLevelGenerator');

chai.should();

describe('TechLevelGenerator.environmentMinTechLevel', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    planet.atmosphere.code = 6;
    planet.hydrographics.code = 6;
  });

  it('atmosphere 0, 1, or A (10) requires TL 8', function () {
    for (const code of [0, 1, 10]) {
      planet.atmosphere.code = code;
      TechLevelGenerator.environmentMinTechLevel(planet).should.equal(8);
    }
  });

  it('atmosphere 2, 3, D (13), or E (14) requires TL 5', function () {
    for (const code of [2, 3, 13, 14]) {
      planet.atmosphere.code = code;
      TechLevelGenerator.environmentMinTechLevel(planet).should.equal(5);
    }
  });

  it('atmosphere 4, 7, or 9 requires TL 3', function () {
    for (const code of [4, 7, 9]) {
      planet.atmosphere.code = code;
      TechLevelGenerator.environmentMinTechLevel(planet).should.equal(3);
    }
  });

  it('atmosphere B (11) requires TL 9', function () {
    planet.atmosphere.code = 11;
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(9);
  });

  it('atmosphere C (12) requires TL 10', function () {
    planet.atmosphere.code = 12;
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(10);
  });

  it('atmosphere F (15) requires TL 8', function () {
    planet.atmosphere.code = 15;
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(8);
  });

  it('atmosphere G (16) or H (17) requires TL 14', function () {
    for (const code of [16, 17]) {
      planet.atmosphere.code = code;
      TechLevelGenerator.environmentMinTechLevel(planet).should.equal(14);
    }
  });

  it('atmosphere with no chart entry and average habitability requires no minimum', function () {
    planet.atmosphere.code = 6;
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(0);
  });

  it('habitability rating 0 requires TL 8', function () {
    planet.size = 6;
    planet.hydrographics.code = 0; // -4
    planet.density = 5; // gravity >= 2 -> -6; combined with hydro, drives habitability to 0
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(8);
  });

  it('habitability rating 1-2 requires TL 5', function () {
    planet.size = 6;
    planet.hydrographics.code = 1; // -2
    planet.density = 5; // gravity >= 2 -> -6; combined with hydro, drives habitability to 2
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(5);
  });

  it('habitability rating 3-7 requires TL 3', function () {
    planet.size = 3; // size <= 4 -> -1
    planet.hydrographics.code = 2; // -2; drives habitability to 7
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(3);
  });

  it('takes the higher of the atmosphere and habitability minimums, not the lower', function () {
    planet.size = 6;
    planet.hydrographics.code = 0;
    planet.density = 5; // drives habitability to 0 -> chart says 8

    planet.atmosphere.code = 2; // atmosphere chart alone says 5; habitability (8) wins
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(8);

    planet.atmosphere.code = 16; // atmosphere chart alone says 14; atmosphere wins
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(14);
  });

  it('does not apply to native sophonts', function () {
    planet.atmosphere.code = 0;
    planet.nativeSophont = true;
    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(0);
  });
});