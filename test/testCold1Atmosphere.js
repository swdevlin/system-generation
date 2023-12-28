"use strict";

const chai = require('chai');
const {ROLL_CACHE, clearCache} = require("../dice");
const cold1 = require("../atmosphere/cold1");
const Star = require("../stars/star");
const {ORBIT_TYPES} = require("../utils");
const TerrestrialPlanet = require("../terrestrialPlanet/terrestrialPlanet");
const AtmosphereDensities = require("../atmosphere/AtmosphereDensities");

chai.should();

describe("tests for cold1 function", function () {
  const planetSize = 7;

  let star;
  beforeEach(() => {
    clearCache();
    star = new Star({stellarClass: 'V', stellarType: 'K', subtype: 5}, ORBIT_TYPES.PRIMARY);
  });

  it("if roll <= size then atmosphere is none", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    const planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(0);
    planet.atmosphere.characteristic.should.equal('');
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 1 or 2 then atmosphere is 1", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(1);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.characteristic.should.equal('');
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.characteristic.should.equal('');
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 3 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_THIN);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_THIN);
    planet.atmosphere.irritant.should.be.true;
  });

  it("if roll of 4 then atmosphere is 10, irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.THIN);
    planet.atmosphere.irritant.should.be.true;
  });

  it("if roll of 5 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.THIN);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 6 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 7 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.true;
  });

  it("if roll of 8 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.DENSE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 9 then atmosphere is 10, irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.DENSE);
    planet.atmosphere.irritant.should.be.true;
  });

  it("if roll of 10 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(3);
    let planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_DENSE);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(4);
    planet = new TerrestrialPlanet(planetSize);
    cold1(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_DENSE);
    planet.atmosphere.irritant.should.be.true;
  });

  it("if roll of 11 then atmosphere is 11", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    cold1(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 12 then atmosphere is 12", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    cold1(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 13 then atmosphere is 13", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(13);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    cold1(star, planet);
    planet.atmosphere.code.should.equal(13);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_DENSE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 14 then atmosphere is corrosive (code 11)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(14);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    cold1(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 15 then atmosphere is unusual (code 15)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(15);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    cold1(star, planet);
    planet.atmosphere.code.should.equal(15);
    planet.atmosphere.density.should.equal(AtmosphereDensities.NONE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 16 then atmosphere is Helium (code 16)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(16);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    cold1(star, planet);
    planet.atmosphere.code.should.equal(16);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Helium');
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 17 then atmosphere is Hydrogen (code 17)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(17);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    cold1(star, planet);
    planet.atmosphere.code.should.equal(17);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Hydrogen');
    planet.atmosphere.irritant.should.be.false;
  });

});
