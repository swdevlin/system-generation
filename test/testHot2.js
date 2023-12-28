"use strict";

const chai = require('chai');
const {ROLL_CACHE, clearCache} = require("../dice");
const hot2 = require("../atmosphere/hot2");
const Star = require("../stars/star");
const {ORBIT_TYPES} = require("../utils");
const TerrestrialPlanet = require("../terrestrialPlanet/terrestrialPlanet");
const AtmosphereDensities = require("../atmosphere/AtmosphereDensities");

chai.should();

describe("tests for hot2 function", function () {
  const planetSize = 7;
  let star;

  beforeEach(() => {
    clearCache();
    star = new Star({stellarClass: 'V', stellarType: 'K', subtype: 5}, ORBIT_TYPES.PRIMARY);
  });

  it("if roll <= size then atmosphere is none (code 0)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(0);
    planet.atmosphere.density.should.equal(AtmosphereDensities.NONE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("if roll of 1 then atmosphere is None (code 0)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(1);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(0);
    planet.atmosphere.density.should.equal(AtmosphereDensities.NONE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 2 is Trace (code 1)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.density.should.equal(AtmosphereDensities.TRACE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 3 is Trace (code 1)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.density.should.equal(AtmosphereDensities.TRACE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 4 is Exotic, trace, corrosive, or insidious", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    // no irritant
    ROLL_CACHE.push(3);
    // no change
    ROLL_CACHE.push(2);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_THIN);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes trace
    ROLL_CACHE.push(1);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.density.should.equal(AtmosphereDensities.TRACE);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes corrosive
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes insidious
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("Roll of 5 is Exotic, trace, corrosive, or insidious", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    // no irritant
    ROLL_CACHE.push(3);
    // no change
    ROLL_CACHE.push(2);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.THIN);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes trace
    ROLL_CACHE.push(1);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.density.should.equal(AtmosphereDensities.TRACE);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes corrosive
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes insidious
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("Roll of 6 is Exotic, trace, corrosive, or insidious", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    // no irritant
    ROLL_CACHE.push(3);
    // no change
    ROLL_CACHE.push(2);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes trace
    ROLL_CACHE.push(1);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(1);
    planet.atmosphere.density.should.equal(AtmosphereDensities.TRACE);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes corrosive
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes insidious
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("Roll of 7 is Exotic, trace, corrosive, or insidious", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    // no irritant
    ROLL_CACHE.push(3);
    // no change
    ROLL_CACHE.push(1);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.DENSE);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes corrosive
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes insidious
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 8 is Exotic (code 10), dense", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    // no irritant
    ROLL_CACHE.push(3);
    // no change
    ROLL_CACHE.push(1);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(10);
    planet.atmosphere.density.should.equal(AtmosphereDensities.VERY_DENSE);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes corrosive
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    // no irritant
    ROLL_CACHE.push(3);
    // becomes insidious
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 9 is Corrosive (code 11)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 10 is Corrosive (code 11)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 11 is Corrosive (code 11)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 12 is Insidious (code 12)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 13 is Corrosive (code 11)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(13);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(11);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 14 is Insidious (code 12)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(14);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    const planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(12);
    planet.atmosphere.density.should.equal(AtmosphereDensities.STANDARD);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 15 is 15", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(15);
    let planet = new TerrestrialPlanet(planetSize);
    hot2(star, planet);
    planet.atmosphere.code.should.equal(15);
    planet.atmosphere.density.should.equal(AtmosphereDensities.NONE);
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 16 is Gas, Helium (code 16)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(16);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(16);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Helium');
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll of 17 is Gas, Hydrogen (code 17)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(17);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(17);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Hydrogen');
    planet.atmosphere.irritant.should.be.false;
  });

  it("roll above 17 is Gas, Hydrogen (code 17)", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(18);
    let planet = new TerrestrialPlanet(planetSize);
    planet.orbit = star.hzco;
    hot2(star, planet);
    planet.atmosphere.code.should.equal(17);
    planet.atmosphere.density.should.equal(AtmosphereDensities.GAS);
    planet.atmosphere.gasType.should.equal('Hydrogen');
    planet.atmosphere.irritant.should.be.false;
  });

});
