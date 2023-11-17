"use strict";

const chai = require('chai');
const {ROLL_CACHE} = require("../dice");
const {hot2} = require("../atmosphere");

chai.should();

describe("tests for hot2 function", function () {
  const planetSize = 7;
  it("if roll <= 1 then atmosphere is none", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    let atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(0);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(1);
    atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(0);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 2 or 3 is 1", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(2);
    let atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(3);
    atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 4", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    let atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(4);
    atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 4 with hzco of less than -3", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(1);
    let atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(5);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(6);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('Very Thin');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 5", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(3);
    let atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(4);
    atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 5 with hzco of less than -3", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(1);
    let atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(5);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(5);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(6);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('Thin');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 6", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    let atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(4);
    atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 6 with hzco of less than -3", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(1);
    let atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(1);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(5);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(6);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(6);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 7", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(3);
    let atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(4);
    atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 7 with hzco of less than -3", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(1);
    let atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(5);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(7);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(7);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('Dense');
    atmosphere.irritant.should.be.false;
  });

  it("if roll of 8", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(3);
    let atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(4);
    atmosphere = hot2(0, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.true;
  });

  it("if roll of 8 with hzco of less than -3", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(1);
    let atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(10);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(3);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(4);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(11);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(5);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(8);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(8);
    atmosphere = hot2(-3.1, planetSize);
    atmosphere.code.should.equal(12);
    atmosphere.characteristic.should.equal('Very Dense');
    atmosphere.irritant.should.be.false;
  });

});
