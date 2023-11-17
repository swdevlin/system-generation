"use strict";

const chai = require('chai');
const {ROLL_CACHE} = require("../dice");
const {cold3} = require('../atmosphere');

chai.should();

describe("tests for cold3 function", function () {
  const planetSize = 7;
  it("if roll <= size then atmosphere is none", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    const atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(0);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 1 or 2 then atmosphere is 1", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(1);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 3 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 4 then atmosphere is 10, irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 5 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 6 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 7 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 8 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 9 then atmosphere is 10, irritant", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(9);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 10 then atmosphere is 10", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(3);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(10);
    ROLL_CACHE.push(4);
    atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 11 then atmosphere is 11", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(11);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 12 then atmosphere is 12", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(12);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 13 then atmosphere is 16", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(13);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(16);
    atmosphere.characteristic.should.equal('');
    atmosphere.gasType.should.equal('Helium');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 14 then atmosphere is 17", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(14);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(17);
    atmosphere.characteristic.should.equal('');
    atmosphere.gasType.should.equal('Hydrogen');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 15 then atmosphere is 15", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(15);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(15);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 16 then atmosphere is 17", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(16);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(17);
    atmosphere.characteristic.should.equal('');
    atmosphere.gasType.should.equal('Hydrogen');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 17 then atmosphere is 17", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(17);
    let atmosphere = cold3(0, planetSize);
    atmosphere.code.should.equal(17);
    atmosphere.characteristic.should.equal('');
    atmosphere.gasType.should.equal('Hydrogen');
    atmosphere.irritant.should.be.false;
  });

});
