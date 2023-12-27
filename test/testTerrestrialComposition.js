"use strict";

const chai = require('chai');

const {ROLL_CACHE} = require("../dice");
const {terrestrialComposition} = require("../terrestrialPlanet");

chai.should();

describe("terrestrial planet composition", function () {
  const planet = {size: 6, orbit: 3};
  const star = {hzco: 3, age: 4};

  it("-4 or less is Exotic ice", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    const composition = terrestrialComposition(star, planet, -4)
    composition.should.equal("Exotic Ice");
  });

  it("-3 - 2 is Mostly ice", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    let composition = terrestrialComposition(star, planet, -3)
    composition.should.equal("Mostly Ice");

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    composition = terrestrialComposition(star, planet, 2)
    composition.should.equal("Mostly Ice");
  });

  it("3-6 is Mostly Rock", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    let composition = terrestrialComposition(star, planet, 3)
    composition.should.equal("Mostly Rock");

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    composition = terrestrialComposition(star, planet, 6)
    composition.should.equal("Mostly Rock");
  });

  it("7-11 is Rock and Metal", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    let composition = terrestrialComposition(star, planet, 7)
    composition.should.equal("Rock and Metal");

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    composition = terrestrialComposition(star, planet, 11)
    composition.should.equal("Rock and Metal");
  });

  it("12-14 is Mostly Metal", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    let composition = terrestrialComposition(star, planet, 12)
    composition.should.equal("Mostly Metal");

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    composition = terrestrialComposition(star, planet, 14)
    composition.should.equal("Mostly Metal");
  });

  it("15+ is Compressed Metal", function() {
    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    let composition = terrestrialComposition(star, planet, 15)
    composition.should.equal("Compressed Metal");

    ROLL_CACHE.push(0);
    ROLL_CACHE.push(0);
    composition = terrestrialComposition(star, planet, 17)
    composition.should.equal("Compressed Metal");
  });

});
