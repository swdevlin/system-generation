'use strict';

const chai = require('chai');

const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { clearCache, ROLL_CACHE } = require('../dice');
const TechLevelGenerator = require('../techLevel/TechLevelGenerator');

chai.should();

describe('TechLevelGenerator.computeTechLevelDetails', function () {
  const CATEGORIES = [
    'energy',
    'electronics',
    'manufacturing',
    'medical',
    'environmental',
    'landTransport',
    'waterTransport',
    'airTransport',
    'spaceTransport',
    'personalMilitary',
    'heavyMilitary',
    'lowCommonTechLevel',
  ];
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    planet.hydrographics.code = 0;
    planet.population.code = 1;
    planet.government.code = 0;
    planet.lawLevel.code = 0;
    planet.population.concentrationRating = 1;
    for (let i = 0; i < 11; i++) ROLL_CACHE.push(3, 4); // neutral techLevelModifiers() every call
  });

  it('floors every category to at least environmentMinTechLevel - 2 in a harsh environment', function () {
    planet.atmosphere.code = 16; // G -> chart 14
    planet.techLevel.code = 14; // as computeTechLevel would produce for this environment

    TechLevelGenerator.computeTechLevelDetails(planet);

    const floor = TechLevelGenerator.environmentMinTechLevel(planet) - 2;
    for (const category of CATEGORIES) {
      planet.techLevel[category].should.be.at.least(floor, category);
    }
  });

  it('produces a finite number for every category in a benign environment', function () {
    planet.atmosphere.code = 6;
    planet.hydrographics.code = 6; // neutral habitability -- beforeEach's 0 would trigger the chart
    planet.techLevel.code = 8;

    TechLevelGenerator.computeTechLevelDetails(planet);

    TechLevelGenerator.environmentMinTechLevel(planet).should.equal(0);
    for (const category of CATEGORIES) {
      planet.techLevel[category].should.be.a('number');
      Number.isFinite(planet.techLevel[category]).should.equal(true);
    }
  });
});