"use strict";

const chai = require('chai');
const Star = require("../star");
const SolarSystem = require("../solarSystem");
const {ORBIT_TYPES} = require("../utils");
const makeCooler = require("../makeCooler");
const {ROLL_CACHE} = require("../dice");

chai.should();

describe("tests for makeCooler function", function () {
  it("type M is smaller subtype", function() {
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(2);
    const star = new Star('IV', 'M', 6, ORBIT_TYPES.PRIMARY);
    const coolerStar = makeCooler(star, ORBIT_TYPES.NEAR);
    coolerStar.stellarClass.should.equal(star.stellarClass);
    coolerStar.stellarType.should.equal(star.stellarType);
    star.subtype.should.be.above(coolerStar.subtype);
  });

  it("if subtype lookup of type M is warmer, then brown dwarf", function() {
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    const star = new Star('IV', 'M', 6, ORBIT_TYPES.PRIMARY);
    const coolerStar = makeCooler(star, ORBIT_TYPES.NEAR);
    coolerStar.stellarClass.should.equal('BD');
    coolerStar.stellarType.should.equal('L');
  });

});
