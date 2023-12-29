"use strict";

const chai = require('chai');

const TerrestrialPlanet = require("../terrestrialPlanet/terrestrialPlanet");
const {clearCache, ROLL_CACHE} = require("../dice");
const {assignStarport, starportDMs} = require("../terrestrialPlanet/assignStarport");

chai.should();

describe("Starport tests", function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it("tech level less than 9 has no starport", function() {
    planet.populationCode = 9;
    planet.techLevel = 8;
    assignStarport(planet);
    planet.starPort.should.equal('X')
  });

  it("2 or less has starport X", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    planet.populationCode = 7;
    planet.techLevel = 9;
    assignStarport(planet);
    planet.starPort.should.equal('X')
  });

  it("4 or less has starport E", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    planet.populationCode = 7;
    planet.techLevel = 9;
    assignStarport(planet);
    planet.starPort.should.equal('E')
  });

  it("6 or less has starport D", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    planet.populationCode = 7;
    planet.techLevel = 9;
    assignStarport(planet);
    planet.starPort.should.equal('D')
  });

  it("8 or less has starport C", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    planet.populationCode = 7;
    planet.techLevel = 9;
    assignStarport(planet);
    planet.starPort.should.equal('C')
  });

  it("10 or less has starport B", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    planet.populationCode = 7;
    planet.techLevel = 9;
    assignStarport(planet);
    planet.starPort.should.equal('B')
  });

  it("11 or more has starport A", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    planet.populationCode = 7;
    planet.techLevel = 9;
    assignStarport(planet);
    planet.starPort.should.equal('A')
  });

});

describe("Starport DM tests", function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it("test DMs", function() {
    planet.populationCode = 2;
    let dm = starportDMs(planet);
    dm.should.equal(-2);

    planet.populationCode = 4;
    dm = starportDMs(planet);
    dm.should.equal(-1);

    planet.populationCode = 7;
    dm = starportDMs(planet);
    dm.should.equal(0);

    planet.populationCode = 9;
    dm = starportDMs(planet);
    dm.should.equal(1);

    planet.populationCode = 10;
    dm = starportDMs(planet);
    dm.should.equal(2);

    planet.populationCode = 12;
    dm = starportDMs(planet);
    dm.should.equal(2);
  });

});
