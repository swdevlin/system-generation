"use strict";

const chai = require('chai');
const Star = require("../star");
const SolarSystem = require("../solarSystem");
const {ORBIT_TYPES} = require("../utils");

chai.should();

describe("Available Orbits", function () {
  let solarSystem;

  beforeEach(function () {
    solarSystem = new SolarSystem();
    const star = new Star('V', 'K', 5, ORBIT_TYPES.PRIMARY);
    star.eccentricity = 0;
    star.companion = new Star('V', 'M', 6, ORBIT_TYPES.COMPANION);
    star.companion.eccentricity = 0.00237;
    solarSystem.addPrimary(star);
    // ...
  });

  it("if companion then minimum is 0.5 + companion's eccentricity", function() {
    const star = new Star('V', 'G', 0, ORBIT_TYPES.PRIMARY);
    star.companion = new Star('V', 'G', 0, ORBIT_TYPES.COMPANION);
    star.companion.eccentricity = 0.3;
    const mao = star.minimumAllowableOrbit;
    mao.should.equal(0.8);
  });

  it("mao is max of star's mao and companion's eccentricity + 0.5", function() {
    const star = new Star('Ib', 'A', 5, ORBIT_TYPES.PRIMARY);
    star.companion = new Star('V', 'G', 0, ORBIT_TYPES.COMPANION);
    star.companion.eccentricity = 0.3;
    const mao = star.minimumAllowableOrbit;
    mao.should.equal(2.17);
  });

  it("available orbits is not negative", function() {
    solarSystem.determineAvailableOrbits();
    solarSystem.primaryStar.availableOrbits.should.have.lengthOf(1);
    solarSystem.primaryStar.availableOrbits[0][1].should.equal(20);
  });

});
