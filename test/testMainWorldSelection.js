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

function makeBeltObject(hzcoDeviation) {
  const obj = new TerrestrialPlanet('S', 0);
  obj.hzcoDeviation = hzcoDeviation;
  obj.orbitType = ORBIT_TYPES.PLANETOID_BELT_OBJECT;
  return obj;
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

  it('planet beats moon at equal population when planet is closer to HZCO', function () {
    const planet = makePlanet(0.9, 5);
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

  it('all zero population: habitable planet (tier 1) beats habitable moon (tier 2) even when GG is closer', function () {
    const planet = makePlanet(3.0, 0);
    const moon = makeMoon(0);
    const gg = makeGasGiantWithMoons(0.5, [moon]);
    star.stellarObjects.push(planet, gg);

    solarSystem.mainWorld.should.equal(planet);
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

  it('no population: moon with size 1 qualifies only when no planets or belts exist', function () {
    const moon = makeMoon(0);
    moon.size = 1;
    const gg = makeGasGiantWithMoons(0.1, [moon]);
    star.stellarObjects.push(gg);

    // moon is the only candidate — it wins
    solarSystem.mainWorld.should.equal(moon);
  });

  it('no population: habitable planet (tier 1) beats habitable moon (tier 2) even when GG is closer', function () {
    const moon = makeMoon(0);
    moon.size = 1;
    const gg = makeGasGiantWithMoons(0.1, [moon]);
    const planet = makePlanet(3.0, 0);
    star.stellarObjects.push(gg, planet);

    solarSystem.mainWorld.should.equal(planet);
  });

  it('no population: moon (tier 4) wins over belt (tier 5) when no planets exist', function () {
    const moon = makeMoon(0);
    moon.size = 1;
    moon.atmosphere.code = 11; // non-habitable — ensures tier 2 is empty, falls to tier 4
    const gg = makeGasGiantWithMoons(0.1, [moon]);
    const belt = makeBelt(3.0, 0);
    star.stellarObjects.push(gg, belt);

    solarSystem.mainWorld.should.equal(moon);
  });

  it('belt significant body is never a main world candidate', function () {
    const beltObj = makeBeltObject(0.017); // very close to HZCO
    const planet = makePlanet(2.0, 0);    // farther away, no population
    star.stellarObjects.push(beltObj, planet);

    solarSystem.mainWorld.should.equal(planet);
  });

  it('moon with higher population beats a planet with lower population', function () {
    const planet = makePlanet(0.5, 2);
    const moon = makeMoon(8);
    const gg = makeGasGiantWithMoons(3.0, [moon]);
    star.stellarObjects.push(planet, gg);

    solarSystem.mainWorld.should.equal(moon);
  });

  it('tier 1: habitable planet beats non-habitable planet closer to HZCO', function () {
    const nonHabitable = makePlanet(0.3, 0);
    nonHabitable.atmosphere.code = 11; // corrosive — HR = 0
    const habitable = makePlanet(2.0, 0); // atmo null — HR = 10
    star.stellarObjects.push(nonHabitable, habitable);

    solarSystem.mainWorld.should.equal(habitable);
  });

  it('tier 1: among habitable planets, highest habitabilityRating wins over closer one', function () {
    const highHR = makePlanet(2.0, 0); // atmo null — HR = 10, farther
    const lowHR = makePlanet(0.5, 0);
    lowHR.atmosphere.code = 5;          // thin breathable — HR = 9, closer
    star.stellarObjects.push(highHR, lowHR);

    solarSystem.mainWorld.should.equal(highHR);
  });

  it('tier 1: HZCO proximity breaks habitabilityRating tie among habitable planets', function () {
    const near = makePlanet(0.5, 0); // atmo null — HR = 10
    const far = makePlanet(2.0, 0);  // atmo null — HR = 10
    star.stellarObjects.push(far, near);

    solarSystem.mainWorld.should.equal(near);
  });

  it('tier 2: habitable moon beats non-habitable planet closer to HZCO', function () {
    const nonHabitable = makePlanet(0.3, 0);
    nonHabitable.atmosphere.code = 11; // HR = 0
    const moon = makeMoon(0); // atmo null — HR = 9
    const gg = makeGasGiantWithMoons(2.0, [moon]);
    star.stellarObjects.push(nonHabitable, gg);

    solarSystem.mainWorld.should.equal(moon);
  });

  it('tier 5: belt wins when no planets or moons exist', function () {
    const belt = makeBelt(1.0, 0);
    star.stellarObjects.push(belt);

    solarSystem.mainWorld.should.equal(belt);
  });
});
