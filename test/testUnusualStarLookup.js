"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const unusualStarLookup = require("../lookups/unusualStarLookup");
const {STELLAR_TYPES} = require("../utils");
chai.should();

describe("Unusual Star Types", function () {
  beforeEach(() => {
    clearCache();
  });

  afterEach(() => {
    clearCache();
  });

  it("Peculiar for 2", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(1);
    let classification = unusualStarLookup({dm: 0});
    classification.stellarClass.should.equal('');
    classification.stellarType.should.equal(STELLAR_TYPES.Pulsar);
  });

  it("VI for 3", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(1);
    let classification = unusualStarLookup({dm: 0});
    classification.stellarClass.should.equal('VI');
    classification.stellarType.should.equal('M');
  });

  it("IV for 4", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(1);
    let classification = unusualStarLookup({dm: 0});
    classification.stellarClass.should.equal('IV');
    classification.stellarType.should.equal('G');
  });

  it("BD for 5-7", function() {
    for (let i = 5; i <= 7; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let classification = unusualStarLookup({dm: 0, unusualChance: 0});
      classification.stellarType.should.equal(STELLAR_TYPES.BrownDwarf);
      classification.stellarClass.should.equal('');
    }
  });

  it("BD for 8-10", function() {
    for (let i = 8; i <= 10; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let classification = unusualStarLookup({dm: 0, unusualChance: 0});
      classification.stellarType.should.equal(STELLAR_TYPES.WhiteDwarf);
      classification.stellarClass.should.equal('');
    }
  });

  it("III for 11", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(2);
    let classification = unusualStarLookup({dm: 0, unusualChance: 0});
    classification.stellarType.should.equal('M');
    classification.stellarClass.should.equal('Ib');
  });
});
