"use strict";

const chai = require('chai');
const {clearCache, ROLL_CACHE} = require("../dice");
const {STELLAR_TYPES} = require("../utils");
const peculiarStarLookup = require("../lookups/peculiarStarLookup");
const giantsStellarClassLookup = require("../lookups/giantsStellarClassLookup");
chai.should();

describe("Peculiar Star Lookup", function () {
  beforeEach(() => {
    clearCache();
  });

  afterEach(() => {
    clearCache();
  });

  it("Black Hole for 2", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    let type = peculiarStarLookup({dm: 0});
    type.should.equal(STELLAR_TYPES.BlackHole);
  });

  it("Pulsar for 3", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    let type = peculiarStarLookup({dm: 0});
    type.should.equal(STELLAR_TYPES.Pulsar);
  });

  it("Neutron Star for 4", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    let type = peculiarStarLookup({dm: 0});
    type.should.equal(STELLAR_TYPES.NeutronStar);
  });

  it("Nebula for 5,6", function() {
    for (let i = 5; i <= 6; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let type = peculiarStarLookup({dm: 0});
      type.should.equal(STELLAR_TYPES.Nebula);
    }
  });

  it("Protostar for 7-9", function() {
    for (let i = 7; i <= 9; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let type = peculiarStarLookup({dm: 0});
      type.should.equal(STELLAR_TYPES.Protostar);
    }
  });

  it("Protostar for 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    let type = peculiarStarLookup({dm: 0});
    type.should.equal(STELLAR_TYPES.StarCluster);
  });

  it("Anomaly is 11,12", function() {
    for (let i = 11; i <= 12; i++) {
      ROLL_CACHE.push(0);
      ROLL_CACHE.push(i);
      let type = peculiarStarLookup({dm: 0});
      type.should.equal(STELLAR_TYPES.Anomaly);
    }
  });

});
