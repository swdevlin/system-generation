"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const specialStarTypeLookup = require("../lookups/specialStarTypeLookup");
chai.should();

describe("Special Star Types", function () {
  beforeEach(() => {
    clearCache();
  });

  it("VI for 2-5", function() {
    for (let i = 1; i < 5; i++) {
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(i);
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(2);
      let classification = specialStarTypeLookup();
      classification.stellarClass.should.equal('VI');
      classification.stellarType.should.equal('M');

    }
  });

  it("IV for 6-8", function() {
    for (let i = 6; i <= 8; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(2);
      let classification = specialStarTypeLookup({dm: 0, unusualChance: 0});
      classification.stellarClass.should.equal('IV');
      // Type check gets +5 on the roll due to class IV
      classification.stellarType.should.equal('G');
    }
  });

  it("III for 9-10", function() {
    for (let i = 3; i < 5; i++) {
      ROLL_CACHE.push(6);
      ROLL_CACHE.push(i);
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(2);
      let classification = specialStarTypeLookup({dm: 0, unusualChance: 0});
      classification.stellarClass.should.equal('III');
      classification.stellarType.should.equal('M');
    }
  });

  it("Giant 11-12", function() {
    for (let i = 11; i <= 12; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      ROLL_CACHE.push(6);
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(3);
      let classification = specialStarTypeLookup();
      classification.stellarClass.should.equal('II');
      classification.stellarType.should.equal('M');
    }
  });
});
