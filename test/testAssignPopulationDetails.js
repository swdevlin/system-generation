'use strict';

const chai = require('chai');
const { ORBIT_TYPES } = require('../utils');
const { clearCache } = require('../dice');
const SolarSystem = require('../solarSystems/solarSystem');
const Star = require('../stars/star');
const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { GasGiant } = require('../gasGiants/gasGiant');
const Moon = require('../moons/moon');

chai.should();

function makeStar() {
  return new Star({ stellarClass: 'V', stellarType: 'G', subtype: 2 }, ORBIT_TYPES.PRIMARY);
}

function makePlanet(populationCode) {
  const planet = new TerrestrialPlanet(6, 3);
  planet.population.code = populationCode;
  return planet;
}

function makeMoonWithPopulation(populationCode) {
  const moon = new Moon(4);
  moon.population.code = populationCode;
  return moon;
}

describe('assignPopulationDetails', function () {
  let solarSystem;
  let star;

  beforeEach(function () {
    clearCache();
    solarSystem = new SolarSystem();
    star = makeStar();
    solarSystem.addPrimary(star);
  });

  it('secondary planet with population gets concentration rating, urbanization, and major cities', function () {
    const mainWorld = makePlanet(8);
    const secondary = makePlanet(4);
    star.stellarObjects.push(mainWorld, secondary);

    solarSystem.assignPopulationDetails();

    secondary.population.concentrationRating.should.not.equal(null);
    secondary.population.urbanizationPercentage.should.not.equal(null);
    secondary.population.majorCities.should.not.equal(null);
  });

  it('populated moon on a gas giant gets population details', function () {
    const mainWorld = makePlanet(8);
    const moon = makeMoonWithPopulation(3);
    const gg = new GasGiant('LGG', 100000, 300, 3);
    gg.moons.push(moon);
    star.stellarObjects.push(mainWorld, gg);

    solarSystem.assignPopulationDetails();

    moon.population.concentrationRating.should.not.equal(null);
    moon.population.urbanizationPercentage.should.not.equal(null);
    moon.population.majorCities.should.not.equal(null);
  });

  it('planet with zero population does not get population details', function () {
    const mainWorld = makePlanet(5);
    const unpopulated = makePlanet(0);
    star.stellarObjects.push(mainWorld, unpopulated);

    solarSystem.assignPopulationDetails();

    (unpopulated.population.concentrationRating === null).should.be.true;
    (unpopulated.population.urbanizationPercentage === null).should.be.true;
    (unpopulated.population.majorCities === null).should.be.true;
  });

  it('main world is skipped and its population details are not set by this method', function () {
    const mainWorld = makePlanet(7);
    star.stellarObjects.push(mainWorld);

    solarSystem.assignPopulationDetails();

    (mainWorld.population.concentrationRating === null).should.be.true;
    (mainWorld.population.urbanizationPercentage === null).should.be.true;
    (mainWorld.population.majorCities === null).should.be.true;
  });

  it('multiple secondary planets with population all get details', function () {
    const mainWorld = makePlanet(9);
    const secondary1 = makePlanet(3);
    const secondary2 = makePlanet(5);
    star.stellarObjects.push(mainWorld, secondary1, secondary2);

    solarSystem.assignPopulationDetails();

    secondary1.population.concentrationRating.should.not.equal(null);
    secondary1.population.urbanizationPercentage.should.not.equal(null);
    secondary1.population.majorCities.should.not.equal(null);

    secondary2.population.concentrationRating.should.not.equal(null);
    secondary2.population.urbanizationPercentage.should.not.equal(null);
    secondary2.population.majorCities.should.not.equal(null);
  });
});
