"use strict";

const chai = require('chai');

const TerrestrialPlanet = require("../terrestrialPlanet/terrestrialPlanet");
const {clearCache, ROLL_CACHE} = require("../dice");
const Star = require("../stars/star");
const {ORBIT_TYPES} = require("../utils");
const {concentrationRatingDMs, assignConcentrationRating} = require("../population/assignConcentrationRating");

chai.should();

describe("Population concentration tests", function () {
  let planet;
  let star;

  beforeEach(() => {
    clearCache();
    star = new Star({stellarClass: 'V', stellarType: 'K', subtype: 5}, ORBIT_TYPES.PRIMARY);
    planet = new TerrestrialPlanet(7);
  });

  describe("Test DMs", function () {
    it('size 1 is +2', function() {
      planet.size = 1;
      planet.techLevel = 10;
      const dm = concentrationRatingDMs(planet);
      dm.should.equal(2);
    });

  });

  describe("Test assignment", function () {
    it("tech level less than 9 has no starport", function() {
      ROLL_CACHE.push(6)
      planet.population.code = 5;
      assignConcentrationRating(star, planet);
      planet.population.concentration = 9;
    });
  });

});
