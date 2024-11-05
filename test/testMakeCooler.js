"use strict";

const chai = require('chai');
const {ORBIT_TYPES, STELLAR_TYPES} = require("../utils");
const {ROLL_CACHE, clearCache} = require("../dice");
const makeCooler = require("../stars/makeCooler");
const Star = require("../stars/star");
const StellarClassification = require("../stars/StellarClassification");

chai.should();

describe("tests for makeCooler function", function () {
  beforeEach(() => {
    clearCache();
  });

  it("type M is smaller subtype", function() {
    const star = new Star({stellarClass: 'IV', stellarType: 'M'}, ORBIT_TYPES.PRIMARY);
    star.subtype = 6;
    ROLL_CACHE.push(2);
    ROLL_CACHE.push(2);
    const coolerStar = makeCooler(star);
    coolerStar.stellarClass.should.equal('V');
    coolerStar.stellarType.should.equal(star.stellarType);
    star.subtype.should.be.above(coolerStar.subtype);
  });

  it("if subtype lookup of type M is warmer, then brown dwarf", function() {
    const star = new Star({stellarClass: 'IV', stellarType: 'M'}, ORBIT_TYPES.PRIMARY);
    star.subtype = 6;
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(2);
    const coolerStar = makeCooler(star);
    coolerStar.stellarClass.should.equal('');
    coolerStar.stellarType.should.equal(STELLAR_TYPES.BrownDwarf);
  });

  it("M6 V", function() {
    const star = new Star({stellarClass: 'V', stellarType: 'M'}, ORBIT_TYPES.PRIMARY);
    star.subtype = 6;
    ROLL_CACHE.push(4);
    ROLL_CACHE.push(3);
    let coolerStar = makeCooler(star);
    coolerStar.stellarClass.should.equal('');
    coolerStar.stellarType.should.equal(STELLAR_TYPES.BrownDwarf);

    ROLL_CACHE.push(2);
    ROLL_CACHE.push(2);
    coolerStar = makeCooler(star);
    coolerStar.stellarClass.should.equal('V');
    coolerStar.stellarType.should.equal('M');
    coolerStar.subtype.should.equal(3);
  });

  it("Y type brown dwarf", function() {
    const s = new StellarClassification();
    s.stellarClass = '';
    s.stellarType = 'BD';
    s.subtype = null;

    const star = new Star(s, ORBIT_TYPES.PRIMARY);
    star.stellarType = 'Y';
    star.subtype = 5;
    let coolerClassification = makeCooler(star);
    coolerClassification.stellarClass.should.equal('');
    coolerClassification.stellarType.should.equal('Y');
    coolerClassification.subtype.should.equal(star.subtype + 1);

    star.subtype = 9;
    coolerClassification = makeCooler(star);
    coolerClassification.stellarClass.should.equal('');
    coolerClassification.stellarType.should.equal('Y');
    coolerClassification.subtype.should.equal(9);
  });

});
