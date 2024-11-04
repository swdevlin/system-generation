"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const secondaryStarLookup = require("../lookups/secondaryStarLookup");
chai.should();

describe("Secondary Star Lookup", function () {
  beforeEach(() => {
    clearCache();
  });

  it("Random 4-6", function() {
    for (let i = 4; i <= 6; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = secondaryStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Random');
    }
  });

  it("Lesser 7-8", function() {
    for (let i = 7; i <= 8; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = secondaryStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Lesser');
    }
  });

  it("Lesser 9-10", function() {
    for (let i = 9; i <= 10; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = secondaryStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Sibling');
    }
  });

  it("Twin 11+", function() {
    for (let i = 11; i <= 13; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = secondaryStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Twin');
    }
  });

  it("Other 2-3", function() {
    for (let i = 2; i <= 3; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(4);
      const stellarClass = secondaryStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('D');
    }
  });


});
