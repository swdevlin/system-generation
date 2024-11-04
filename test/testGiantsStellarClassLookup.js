"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const giantsStellarClassLookup = require("../lookups/giantsStellarClassLookup");
chai.should();

describe("Giant Star Classes", function () {
  beforeEach(() => {
    clearCache();
  });

  it("III for 2-8", function() {
    for (let i = 2; i <= 8; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let stellarClass = giantsStellarClassLookup();
      stellarClass.should.equal('III');
    }
  });

  it("II for 9-10", function() {
    for (let i = 9; i <= 10; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let stellarClass = giantsStellarClassLookup();
      stellarClass.should.equal('II');
    }
  });

  it("Ib for 11", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    let stellarClass = giantsStellarClassLookup();
    stellarClass.should.equal('Ib');
  });

  it("Ib for 12", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    let stellarClass = giantsStellarClassLookup();
    stellarClass.should.equal('Ia');
  });
});
