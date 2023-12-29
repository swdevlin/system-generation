"use strict";

const chai = require('chai');

const TerrestrialPlanet = require("../terrestrialPlanet/terrestrialPlanet");
const {clearCache, ROLL_CACHE} = require("../dice");
const {techLevelDMs} = require("../terrestrialPlanet/assignTechLevel");

chai.should();

describe("Tech level tests", function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(6);
    // page 172 -- the DM is 0 for 6s
    planet.atmosphere.code = 6;
    planet.hydrographics.code = 6;
    planet.populationCode = 6;
    planet.governmentCode = 6;
  });

  it("size less than 2 is +2", function() {
    planet.size = 1;
    const dm = techLevelDMs(planet);
    dm.should.equal(2)
  });

  it("size 5 or more is 0", function() {
    planet.size = 5;
    const dm = techLevelDMs(planet);
    dm.should.equal(0)
  });

  it("size 2-4 is +1", function() {
    planet.size = 2;
    let dm = techLevelDMs(planet);
    dm.should.equal(1)

    planet.size = 4;
    dm = techLevelDMs(planet);
    dm.should.equal(1)
  });

  it("atmosphere 0-3 is +1", function() {
    planet.atmosphere.code = 3;
    let dm = techLevelDMs(planet);
    dm.should.equal(1)
  });

  it("atmosphere 10-17 is +1", function() {
    planet.atmosphere.code = 10;
    let dm = techLevelDMs(planet);
    dm.should.equal(1)

    planet.atmosphere.code = 17;
    dm = techLevelDMs(planet);
    dm.should.equal(1)
  });

  it("atmosphere 4-9 is 0", function() {
    planet.atmosphere.code = 4;
    let dm = techLevelDMs(planet);
    dm.should.equal(0)

    planet.atmosphere.code = 9;
    dm = techLevelDMs(planet);
    dm.should.equal(0)
  });

  describe("hydrographic tests", function () {
    it("hydrographics 0 is +1", function () {
      planet.hydrographics.code = 0;
      let dm = techLevelDMs(planet);
      dm.should.equal(1)
    });

    it("hydrographics 1-8 is 0", function () {
      planet.hydrographics.code = 1;
      let dm = techLevelDMs(planet);
      dm.should.equal(0)

      planet.hydrographics.code = 8;
      dm = techLevelDMs(planet);
      dm.should.equal(0)
    });

    it("hydrographics 9 is +1", function () {
      planet.hydrographics.code = 9;
      let dm = techLevelDMs(planet);
      dm.should.equal(1)
    });

    it("hydrographics 10 is +2", function () {
      planet.hydrographics.code = 10;
      let dm = techLevelDMs(planet);
      dm.should.equal(2)
    });
  });

  describe("population tests", function () {
    it("population 1-5 is 1", function() {
      planet.populationCode = 1;
      let dm = techLevelDMs(planet);
      dm.should.equal(1)

      planet.populationCode = 5;
      dm = techLevelDMs(planet);
      dm.should.equal(1)
    });

    it("population 8 is +1", function () {
      planet.populationCode = 8;
      let dm = techLevelDMs(planet);
      dm.should.equal(1)
    });

    it("population 9 is +2", function () {
      planet.populationCode = 9;
      let dm = techLevelDMs(planet);
      dm.should.equal(2)
    });

    it("population of 10 or greater +4", function () {
      planet.populationCode = 10;
      let dm = techLevelDMs(planet);
      dm.should.equal(4)

      planet.populationCode = 13;
      dm = techLevelDMs(planet);
      dm.should.equal(4)
    });
  });

  describe("government tests", function () {
    it("government 0 is +1", function() {
      planet.governmentCode = 0;
      const dm = techLevelDMs(planet);
      dm.should.equal(1)
    });

    it("government 5 is +1", function() {
      planet.governmentCode = 5;
      const dm = techLevelDMs(planet);
      dm.should.equal(1)
    });

    it("government 7 is +2", function() {
      planet.governmentCode = 7;
      const dm = techLevelDMs(planet);
      dm.should.equal(2)
    });

    it("government 13 is -2", function() {
      planet.governmentCode = 13;
      const dm = techLevelDMs(planet);
      dm.should.equal(-2)
    });

    it("government 14 is -2", function() {
      planet.governmentCode = 14;
      const dm = techLevelDMs(planet);
      dm.should.equal(-2)
    });

    it("government 9 is 0", function () {
      planet.governmentCode = 9;
      const dm = techLevelDMs(planet);
      dm.should.equal(0)
    });
  });
});
