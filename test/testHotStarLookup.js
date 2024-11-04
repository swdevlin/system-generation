"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const hotStarLookup = require("../lookups/hotStarLookup");
chai.should();

describe("Hot Star Lookup", function () {
  beforeEach(() => {
    clearCache();
  });

  it("A is 2-9", function() {
    for (let i = 1; i < 9; i++) {
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(i);
      const stellarClass = hotStarLookup({stellarClass: null});
      stellarClass.should.equal('A');
    }
  });

  it("B is 10-11", function() {
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(4);
    let type = hotStarLookup({stellarClass: null});
    type.should.equal('B');

    ROLL_CACHE.push(6);
    ROLL_CACHE.push(5);
    type = hotStarLookup({stellarClass: null});
    type.should.equal('B');
  });

  it("O is 12+", function() {
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(6);
    let type = hotStarLookup({stellarClass: null});
    type.should.equal('O');

    ROLL_CACHE.push(6);
    ROLL_CACHE.push(6);
    type = hotStarLookup({stellarClass: null});
    type.should.equal('O');
  });
});
