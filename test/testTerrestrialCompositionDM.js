"use strict";

const chai = require('chai');
const terrestrialCompositionDM = require("../terrestrialPlanet/terrestrialCompositionDM");
const {clearCache} = require("../dice");
chai.should();

describe("Terrestrial Composition", function () {
  beforeEach(() => {
    clearCache();
  });

  it("Size 0-4 is -1 (+1 because of hzco)", function() {
    const star = {hzco: 3, age: 4};
    const planet = {size: 0, orbit: 3, effectiveHZCODeviation: 0, hzcoDeviation: 0};
    let dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(0);

    planet.size = 1;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(0);

    planet.size = 2;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(0);

    planet.size = 3;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(0);

    planet.size = 4;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(0);
  });

  it("beyond hzco subtracts 1", function() {
    const planet = {size: 0, orbit: 3.5, effectiveHZCODeviation: 0.5, hzcoDeviation: 0.5};
    const star = {hzco: 3, age: 4};
    let dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(-2);
  });

  it("system age greater than 10 is -1 (+1 for hzco)", function() {
    const planet = {size: 5, orbit: 3, effectiveHZCODeviation: 0, hzcoDeviation: 0};
    const star = {hzco: 3, age: 12};
    let dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(0);
  });

  it("every full orbit number beyond hzco subtracts 1", function() {
    const planet = {size: 5, orbit: 7, effectiveHZCODeviation: 4, hzcoDeviation: 4};
    const star = {hzco: 3, age: 4};
    let dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(-5);
  });

  it("Size 6-9 is +1 (+1 because of hzco)", function() {
    const planet = {size: 6, orbit: 3, effectiveHZCODeviation: 0, hzcoDeviation: 0};
    const star = {hzco: 3, age: 4};
    let dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(2);

    planet.size = 7;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(2);

    planet.size = 8;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(2);

    planet.size = 9;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(2);
  });

  it("Size A-F is +3 (+1 because of hzco)", function() {
    const planet = {size: 10, orbit: 3, effectiveHZCODeviation: 0, hzcoDeviation: 0};
    const star = {hzco: 3, age: 4};
    let dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(4);

    planet.size = 11;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(4);

    planet.size = 12;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(4);

    planet.size = 13;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(4);

    planet.size = 14;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(4);

    planet.size = 15;
    dm = terrestrialCompositionDM(star, planet);
    dm.should.equal(4);
  });

});
