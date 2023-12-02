"use strict";

const chai = require('chai');
const {ORBIT_TYPES, STELLAR_TYPES} = require("../utils");
const Random = require("random-js").Random;

const r = new Random();
const {d6} = require("../dice");
const SolarSystem = require("../solarSystems/solarSystem");
const Star = require("../stars/star");

chai.should();

describe("Available Orbits", function () {
  let solarSystem;

  beforeEach(function () {
    solarSystem = new SolarSystem();
    const star = new Star({stellarClass: 'V', stellarType: 'K', subtype: 5}, ORBIT_TYPES.PRIMARY);
    star.eccentricity = 0;
    star.companion = new Star({stellarClass: 'V', stellarType: 'M', subtype: 6}, ORBIT_TYPES.COMPANION);
    star.companion.eccentricity = 0.00237;
    solarSystem.addPrimary(star);
  });

  it("if companion then minimum is 0.5 + companion's eccentricity", function() {
    const star = new Star({stellarClass: 'V', stellarType: 'G', subtype: 0}, ORBIT_TYPES.PRIMARY);
    star.companion = new Star({stellarClass: 'V', stellarType: 'G', subtype: 0}, ORBIT_TYPES.COMPANION);
    star.companion.eccentricity = 0.3;
    const mao = star.minimumAllowableOrbit;
    mao.should.equal(0.8);
  });

  it("mao is max of star's mao and companion's eccentricity + 0.5", function() {
    const star = new Star({stellarClass: 'Ib', stellarType: 'A', subtype: 5}, ORBIT_TYPES.PRIMARY);
    star.companion = new Star({stellarClass: 'V', stellarType: 'G', subtype: 0}, ORBIT_TYPES.COMPANION);
    star.companion.eccentricity = 0.3;
    const mao = star.minimumAllowableOrbit;
    mao.should.equal(1.4);
  });

  it("available orbits is not negative", function() {
    solarSystem.determineAvailableOrbits();
    solarSystem.primaryStar.availableOrbits.should.have.lengthOf(1);
    solarSystem.primaryStar.availableOrbits[0][1].should.equal(20);
  });

  it("Near brown dwarf will not have any orbits", function() {
    const star = new Star({stellarClass: '', stellarType: STELLAR_TYPES.BrownDwarf, subtype: null}, ORBIT_TYPES.NEAR);
    star.orbit = 2.6;
    solarSystem.addStar(star);
    solarSystem.determineAvailableOrbits();
    star.availableOrbits.should.have.lengthOf(0);
  });

  it("close star with high eccentricity pushes minimum orbit number outside the close star", function() {
    const solars = new SolarSystem();
    const primary = new Star({stellarClass: 'V', stellarType: 'K', subtype: 5}, ORBIT_TYPES.PRIMARY);
    solars.addPrimary(primary);
    let star;
    star = new Star({stellarClass: 'V', stellarType: 'G', subtype: 7}, ORBIT_TYPES.CLOSE);
    star.orbit = 0.9;
    star.eccentricity = 0.7;
    solars.addStar(star);

    star = new Star({stellarClass: 'IV', stellarType: 'K', subtype: 2}, ORBIT_TYPES.NEAR);
    star.orbit = d6()+5 + r.integer(0,9)/10 - 0.5;
    solars.addStar(star);
    solars.determineAvailableOrbits();
    primary.availableOrbits.should.have.lengthOf(2);
    primary.availableOrbits[0][0].should.equal(3.9);
  });


});
