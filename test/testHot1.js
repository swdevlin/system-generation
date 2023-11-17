"use strict";

const chai = require('chai');
const {ROLL_CACHE} = require("../dice");
const {hot1} = require("../atmosphere");

chai.should();

describe("tests for hot1 function", function () {
  const planetSize = 7;
  it("if roll <= size then atmosphere is none", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(0);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 1 then atmosphere is 1", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(1);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 2 is very thin 10 and irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.true;
  });

  it("roll of 3 is very thin 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 4 is thin 10 and irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.true;
  });

  it("roll of 5 is thin 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 6 is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 7 is 10 irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.true;
  });

  it("roll of 8 is 10 dense", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 9 is 10 dense irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.true;
  });

  it("roll of 10 is 10 very dense", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(4);
    let atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.true;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(3);
    atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 11 is 11", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 12 is 12", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 13 is 11", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(13);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 14 is 12", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(14);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 15 is 15", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(15);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(15);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll of 16 is 16", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(16);
    const atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(16);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("roll 17 or higher is 17", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(17);
    let atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(17);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(18);
    atmosphere = hot1(0, planetSize);
    atmosphere.code.should.equal(17);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });
});
