"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const companionStarLookup = require("../lookups/companionStarLookup");
chai.should();

describe("Secondary Star Lookup", function () {
  beforeEach(() => {
    clearCache();
  });

  it("Random 4-5", function() {
    for (let i = 4; i <= 5; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = companionStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Random');
    }
  });

  it("Lesser 6-7", function() {
    for (let i = 6; i <= 7; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = companionStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Lesser');
    }
  });

  it("Sibling 8-9", function() {
    for (let i = 8; i <= 9; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = companionStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Sibling');
    }
  });

  it("Twin 10+", function() {
    for (let i = 10; i <= 13; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      const stellarClass = companionStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('Twin');
    }
  });

  it("Other 2-3", function() {
    for (let i = 2; i <= 3; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(4);
      const stellarClass = companionStarLookup({primary: {stellarClass: 'V'}});
      stellarClass.should.equal('D');
    }
  });


});
