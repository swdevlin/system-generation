"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const starTypeLookup = require("../lookups/starTypeLookup");
chai.should();

describe("Star Type Lookup", function () {
  beforeEach(() => {
    clearCache();
  });

  it("Special for 2", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    let type = starTypeLookup({dm: 0, stellarClass: null});
    type.should.equal('special');
  });

  it("M for 3-6", function() {
    for (let i = 3; i <= 6; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let type = starTypeLookup({dm: 0});
      type.should.equal('M');
    }
  });

  it("K for 7-8", function() {
    for (let i = 7; i <= 8; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let type = starTypeLookup({dm: 0});
      type.should.equal('K');
    }
  });

  it("G for 9-10", function() {
    for (let i = 9; i <= 10; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let type = starTypeLookup({dm: 0});
      type.should.equal('G');
    }
  });

  it("F for 11", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    let type = starTypeLookup({dm: 0, stellarClass: null});
    type.should.equal('F');
  });

  it("Hot for 12", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    let type = starTypeLookup({dm: 0, stellarClass: null});
    type.should.equal('hot');
  });

  it("DM is applied", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    let type = starTypeLookup({dm: 1, stellarClass: null});
    type.should.equal('M');

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    type = starTypeLookup({dm: 1, stellarClass: null});
    type.should.equal('hot');
  });
});
