'use strict';

const chai = require('chai');
const { ROLL_CACHE, clearCache } = require('../dice');
const hot1 = require('../atmosphere/hot1');
const Star = require('../stars/star');
const { ORBIT_TYPES } = require('../utils');
const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const AtmosphereDensities = require('../atmosphere/AtmosphereDensities');

chai.should();

describe('tests for hot1 function', function () {
  const planetSize = 7;
  let star;

  beforeEach(() => {
    clearCache();
    star = new Star({ stellarClass: 'V', stellarType: 'K', subtype: 5 }, ORBIT_TYPES.PRIMARY);
  });

  it('if roll <= size then atmosphere is none (code 0)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(0);
    planet.atmosphere.density.should.equal(AtmosphereDensities.NONE);
    planet.atmosphere.irritant.should.be.false;
  });

  it('if roll of 1 then atmosphere is 1', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(1);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.density.should.equal(AtmosphereDensities.TRACE);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 2 is Exotic (code 10), very thin and irritant', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_THIN);
    planet.atmosphere.irritant.should.be.true;
  });

  it('roll of 3 is Exotic (code 10), very thin', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_THIN);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 4 is Exotic (code 10), thin and irritant', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.THIN);
    planet.atmosphere.irritant.should.be.true;
  });

  it('roll of 5 is Exotic (code 10), thin', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.THIN);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 6 is Exotic (code 10), standard', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 7 is Exotic (code 10), standard, irritant', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.true;
  });

  it('roll of 8 is Exotic (code 10), dense', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.DENSE);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 9 is Exotic (code 10), dense irritant', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.DENSE);
    planet.atmosphere.irritant.should.be.true;
  });

  it('roll of 10 is Exotic (code 10), very dense', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(4);
    let planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_DENSE);
    planet.atmosphere.irritant.should.be.true;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_DENSE);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 11 is Corrosive (code 11)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 12 is Insidious (code 12)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 13 is Corrosive (code 11)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(13);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 14 is Insidious (code 12)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(14);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 15 is 15', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(15);
    let planet = new TerrestrialPlanet(planetSize);
    hot1(star, planet);
    planet.atmosphere.code.should.equal(15);
    planet.atmosphere.density.should.equal(AtmosphereDensities.NONE);
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 16 is Gas, Helium (code 16)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(16);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot1(star, planet);
    planet.atmosphere.code.should.equal(16);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Helium');
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll of 17 is Gas, Hydrogen (code 17)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(17);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot1(star, planet);
    planet.atmosphere.code.should.equal(17);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Hydrogen');
    planet.atmosphere.irritant.should.be.false;
  });

  it('roll above 17 is Gas, Hydrogen (code 17)', function () {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(18);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot1(star, planet);
    planet.atmosphere.code.should.equal(17);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Hydrogen');
    planet.atmosphere.irritant.should.be.false;
  });
});
