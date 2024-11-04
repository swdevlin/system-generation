"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const {assert} = require("chai");
const {multiStarClassification} = require("../stars/determineStarClassification");
const {ORBIT_TYPES} = require("../utils");
chai.should();

describe("Multi Star Classification", function () {
  let primary;
  beforeEach(() => {
    clearCache();
    primary = {
      stellarType: 'K',
      stellarClass: 'V',
      subtype: 5,
    }
  });

  it("Other lookup", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    let classification = multiStarClassification({
      primary: primary,
      unusualChance: 0,
      orbitType: ORBIT_TYPES.NEAR,
    });
    classification.stellarClass.should.equal('');
    classification.stellarType.should.equal('D');
    assert.isNull(classification.subtype);
  });

  it("Lesser", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    let classification = multiStarClassification({
      primary: primary,
      unusualChance: 0,
      orbitType: ORBIT_TYPES.NEAR,
    });
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('M');
    classification.subtype.should.equal(3);
  });

  it("Sibling", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);
    ROLL_CACHE.push(1);
    let classification = multiStarClassification({
      primary: primary,
      unusualChance: 0,
      orbitType: ORBIT_TYPES.NEAR,
    });
    classification.stellarClass.should.equal(primary.stellarClass);
    classification.stellarType.should.equal(primary.stellarType);
    classification.subtype.should.equal(primary.subtype+1);
  });

  it("Sibling, next cooler type", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);
    ROLL_CACHE.push(6);
    primary.subtype = 7;
    let classification = multiStarClassification({
      primary: primary,
      unusualChance: 0,
      orbitType: ORBIT_TYPES.NEAR,
    });
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('M');
    classification.subtype.should.equal(3);
  });

  it("Twin", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    let classification = multiStarClassification({
      primary: primary,
      unusualChance: 0,
      orbitType: ORBIT_TYPES.NEAR,
    });
    classification.stellarClass.should.equal(primary.stellarClass);
    classification.stellarType.should.equal(primary.stellarType);
    classification.subtype.should.equal(primary.subtype);
  });
});
