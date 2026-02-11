"use strict";

const chai = require('chai');
const {ORBIT_TYPES, STELLAR_TYPES} = require("../utils");
const Random = require("random-js").Random;

const r = new Random();
const {d6, clearCache, twoD6, ROLL_CACHE} = require("../dice");
const SolarSystem = require("../solarSystems/solarSystem");
const Star = require("../stars/star");
const star = require("../stars/star");

chai.should();

describe("Assign main world from counts section", function () {
  let solarSystem;
  let orbits;

  beforeEach(function () {
    clearCache();
    solarSystem = new SolarSystem();
    const star = new Star({stellarClass: 'V', stellarType: 'K', subtype: 5}, ORBIT_TYPES.PRIMARY);
    solarSystem.addPrimary(star);
    solarSystem.gasGiants = 3;
    solarSystem.planetoidBelts = 3;
    solarSystem.terrestrialPlanets = 3;
    star.totalObjects = 9;

    star.spread = 0.4;
    let orbit = 0.05;
    star.occupiedOrbits.push(orbit);
    // mao = 0.02
    orbit = star.minimumAllowableOrbit + star.spread;
    star.occupiedOrbits.push(orbit);
    for (let i = 1; i < 9; i++) {
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(4);
      orbit = star.nextAvailableOrbit(orbit);
      star.occupiedOrbits.push(orbit);
    }
    orbits = [
      [star, 4], // 1.62
      [star, 3], // 1.22
      [star, 9], // 3.62
      [star, 7], // 2.82
      [star, 8], // 3.22
      [star, 2], // 0.82
      [star, 5], // 2.02
      [star, 1], // 0.42
      [star, 0], // 0.05
      [star, 6], // 2.42
    ];
  });

  it("If orbit is not specified, then orbit is random", function() {
    solarSystem.mainFromDefinition = {uwp: 'B874409-X'};
    const before = orbits.length;
    solarSystem.assignMainWorld(orbits);
    const after = orbits.length;
    before.should.equal(after+1);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.stellarObjects[0].orbit);
  });

  it("is assigned to orbit index if specified", function() {
    solarSystem.mainFromDefinition = {uwp: 'B874409-X', orbit: 1};
    solarSystem.assignMainWorld(orbits);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.occupiedOrbits[0]);
  });

  it("is in habitable zone", function() {
    // hzco is 1.21
    solarSystem.mainFromDefinition = {uwp: 'B874409-X', orbit: 'habitable'};
    solarSystem.assignMainWorld(orbits);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.occupiedOrbits[4]);
  });

  it("is nearest to hzco", function() {
    solarSystem.mainFromDefinition = {uwp: 'B874409-X', orbit: 'hzco'};
    solarSystem.assignMainWorld(orbits);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.occupiedOrbits[3]);
  });

  it("is on the far size of the hzco", function() {
    solarSystem.mainFromDefinition = {uwp: 'B874409-X', orbit: 'cold'};
    solarSystem.assignMainWorld(orbits);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.occupiedOrbits[5]);
  });

  it("is on the near size of the hzco", function() {
    solarSystem.mainFromDefinition = {uwp: 'B874409-X', orbit: 'warm'};
    solarSystem.assignMainWorld(orbits);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.occupiedOrbits[1]);
  });

  it("outer is any on the far side of the hzco", function() {
    solarSystem.mainFromDefinition = {uwp: 'B874409-X', orbit: 'outer'};
    solarSystem.assignMainWorld(orbits);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.occupiedOrbits[9]);
  });

  it("inner is any on the near side of the hzco", function() {
    solarSystem.mainFromDefinition = {uwp: 'B874409-X', orbit: 'inner'};
    solarSystem.assignMainWorld(orbits);
    solarSystem._mainWorld.orbit.should.equal(solarSystem.primaryStar.occupiedOrbits[0]);
  });
});
