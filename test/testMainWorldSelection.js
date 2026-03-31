'use strict';

const chai = require('chai');
const { ORBIT_TYPES } = require('../utils');
const { clearCache } = require('../dice');
const SolarSystem = require('../solarSystems/solarSystem');
const Star = require('../stars/star');
const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { GasGiant } = require('../gasGiants/gasGiant');
const Moon = require('../moons/moon');
const PlanetoidBelt = require('../planetoidBelts/planetoidBelt');

chai.should();

function makeStar() {
  return new Star({ stellarClass: 'V', stellarType: 'G', subtype: 2 }, ORBIT_TYPES.PRIMARY);
}

function makePlanet(hzcoDeviation, populationCode) {
  const planet = new TerrestrialPlanet(6, 3);
  planet.hzcoDeviation = hzcoDeviation;
  planet.population.code = populationCode;
  return planet;
}

function makeBelt(hzcoDeviation, populationCode) {
  const belt = new PlanetoidBelt(3);
  belt.hzcoDeviation = hzcoDeviation;
  belt.population.code = populationCode;
  return belt;
}

function makeBeltObject(hzcoDeviation, parentBelt) {
  const planet = new TerrestrialPlanet(1, 3);
  planet.hzcoDeviation = hzcoDeviation;
  planet.orbitType = ORBIT_TYPES.PLANETOID_BELT_OBJECT;
  planet.belt = parentBelt;
  return planet;
}

function makeGasGiantWithMoons(hzcoDeviation, moons) {
  const gg = new GasGiant('LGG', 100000, 300, 3);
  gg.hzcoDeviation = hzcoDeviation;
  for (const moon of moons) gg.moons.push(moon);
  return gg;
}

function makeMoon(populationCode) {
  const moon = new Moon(4);
  moon.population.code = populationCode;
  return moon;
}

describe('mainWorld selection (computed)', function () {
  let solarSystem;
  let star;

  beforeEach(function () {
    clearCache();
    solarSystem = new SolarSystem();
    star = makeStar();
    solarSystem.addPrimary(star);
  });

  it('planet with highest population wins', function () {
    const low = makePlanet(0.5, 3);
    const high = makePlanet(2.0, 7);
    star.stellarObjects.push(low, high);

    solarSystem.mainWorld.should.equal(high);
  });

  it('planet beats moon at equal population', function () {
    const planet = makePlanet(1.0, 5);
    const moon = makeMoon(5);
    const gg = makeGasGiantWithMoons(1.0, [moon]);
    star.stellarObjects.push(planet, gg);

    solarSystem.mainWorld.should.equal(planet);
  });

  it('all zero population: planet closest to HZCO wins', function () {
    const near = makePlanet(0.3, 0);
    const far = makePlanet(2.5, 0);
    star.stellarObjects.push(far, near);

    solarSystem.mainWorld.should.equal(near);
  });

  it('all zero population: planet beats moon when planet is closer to HZCO', function () {
    const planet = makePlanet(0.8, 0);
    const moon = makeMoon(0);
    const gg = makeGasGiantWithMoons(1.5, [moon]);
    star.stellarObjects.push(planet, gg);

    solarSystem.mainWorld.should.equal(planet);
  });

  it('all zero population: moon wins when its host GG is closer to HZCO than any planet', function () {
    const planet = makePlanet(3.0, 0);
    const moon = makeMoon(0);
    const gg = makeGasGiantWithMoons(0.5, [moon]);
    star.stellarObjects.push(planet, gg);

    solarSystem.mainWorld.should.equal(moon);
  });

  it('returns null without throwing when there are no bodies', function () {
    const result = solarSystem.mainWorld;
    (result === null).should.be.true;
  });

  it('planetoid belt is a valid candidate and wins on population', function () {
    const planet = makePlanet(0.5, 3);
    const belt = makeBelt(2.0, 6);
    star.stellarObjects.push(planet, belt);

    solarSystem.mainWorld.should.equal(belt);
  });

  it('no population: moon with size 0 is excluded as a candidate', function () {
    const moon = makeMoon(0);
    moon.size = 0;
    const gg = makeGasGiantWithMoons(0.1, [moon]);
    const planet = makePlanet(3.0, 0);
    star.stellarObjects.push(gg, planet);

    // moon is closer to HZCO but too small — planet wins
    solarSystem.mainWorld.should.equal(planet);
  });

  it('no population: moon with size 1 qualifies', function () {
    const moon = makeMoon(0);
    moon.size = 1;
    const gg = makeGasGiantWithMoons(0.1, [moon]);
    const planet = makePlanet(3.0, 0);
    star.stellarObjects.push(gg, planet);

    // moon is closer to HZCO and meets minimum size — moon wins
    solarSystem.mainWorld.should.equal(moon);
  });

  it('moon with higher population beats a planet with lower population', function () {
    const planet = makePlanet(0.5, 2);
    const moon = makeMoon(8);
    const gg = makeGasGiantWithMoons(3.0, [moon]);
    star.stellarObjects.push(planet, gg);

    solarSystem.mainWorld.should.equal(moon);
  });

  it('no population: planetoid belt object is excluded; belt itself is the candidate', function () {
    const belt = makeBelt(0.3, 0);
    const beltObj = makeBeltObject(0.3, belt);
    const planet = makePlanet(3.0, 0);
    star.stellarObjects.push(belt, beltObj, planet);

    solarSystem.mainWorld.should.equal(belt);
  });

  it('no population: habitable-zone terrestrial beats a closer belt', function () {
    const belt = makeBelt(0.2, 0);
    const planet = makePlanet(0.5, 0);  // in habitable zone (< 1)
    star.stellarObjects.push(belt, planet);

    solarSystem.mainWorld.should.equal(planet);
  });

  it('no population: belt wins when terrestrial is outside habitable zone', function () {
    const belt = makeBelt(0.2, 0);
    const planet = makePlanet(1.5, 0);  // outside habitable zone
    star.stellarObjects.push(belt, planet);

    solarSystem.mainWorld.should.equal(belt);
  });
});
