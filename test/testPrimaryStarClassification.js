"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const {primaryStarClassification} = require("../stars/determineStarClassification");
const {assert} = require("chai");
chai.should();

describe("Primary Star Classification", function () {
  beforeEach(() => {
    clearCache();
  });

  it("M for 3-6", function() {
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(2);
    let classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('M');

    ROLL_CACHE.push(1);
    ROLL_CACHE.push(3);
    classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('M');

    ROLL_CACHE.push(1);
    ROLL_CACHE.push(4);
    classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('M');

    ROLL_CACHE.push(1);
    ROLL_CACHE.push(5);
    classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('M');
  });

  it("K for 7-8", function() {
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    let classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('K');

    ROLL_CACHE.push(3);
    ROLL_CACHE.push(5);
    classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('K');
  });

  it("G for 9-10", function() {
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(5);
    let classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('G');

    ROLL_CACHE.push(5);
    ROLL_CACHE.push(5);
    classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('G');
  });

  it("F for 11", function() {
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(6);
    const classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('F');
  });

  it("Hot is a V", function() {
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    const classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('A');
  });

  it("Roll of 2 is a special", function() {
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    const classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('VI');
    classification.stellarType.should.equal('G');
  });

  it("Giant is assigned", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // giant
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(6);
    // class II
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    // type k
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(2);
    const classification = primaryStarClassification({unusualChance: 0});
    classification.stellarClass.should.equal('II');
    classification.stellarType.should.equal('K');
  });

  it("Unusual is assigned", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Class VI on unusual
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    // type k
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(2);
    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarClass.should.equal('VI');
    classification.stellarType.should.equal('K');
  });

  it("White Dwarf", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Class VI on unusual
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);

    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarClass.should.equal('');
    classification.stellarType.should.equal('D');
    assert.isNull(classification.subtype);
  });

  it("Brown Dwarf", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Class VI on unusual
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);

    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarType.should.equal('BD');
    classification.stellarClass.should.equal('');
    assert.isNull(classification.subtype);
  });

  it("Pulsar", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Peculiar
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    // Pulsar
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);

    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarClass.should.equal('');
    classification.stellarType.should.equal('PSR');
    assert.isNull(classification.subtype);
  });

  it("Neutron Star", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Peculiar
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    // Neutron Star
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);

    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarClass.should.equal('');
    classification.stellarType.should.equal('NS');
    assert.isNull(classification.subtype);
  });

  it("Nebula", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Peculiar
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    // Neutron Star
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);

    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarClass.should.equal('');
    classification.stellarType.should.equal('NB');
    assert.isNull(classification.subtype);
  });

  it("Star cluster", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Peculiar
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    // Star cluster
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);

    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarClass.should.equal('');
    classification.stellarType.should.equal('SC');
    assert.isNull(classification.subtype);
  });

  it("Protostar", function() {
    // special
    ROLL_CACHE.push(1);
    ROLL_CACHE.push(1);
    // Peculiar
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    // Protostar
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    // F, since the lookup is +1
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    // Subtype 5
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);

    const classification = primaryStarClassification({unusualChance: 1});
    classification.stellarClass.should.equal('V');
    classification.stellarType.should.equal('F');
    classification.isProtostar.should.be.true;
    classification.subtype.should.equal(5);
  });
});
