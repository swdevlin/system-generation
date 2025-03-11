"use strict";

const chai = require('chai');
const {ORBIT_TYPES, STELLAR_TYPES} = require("../utils");
const Random = require("random-js").Random;

const r = new Random();
const {d6, clearCache, ROLL_CACHE} = require("../dice");
const SolarSystem = require("../solarSystems/solarSystem");
const Star = require("../stars/star");
const addCompanion = require("../stars/addCompanion");

chai.should();

describe("Brown Dwarf Tests", function () {
  let solarSystem;

  beforeEach(function () {
    clearCache();
    solarSystem = new SolarSystem();
    const star = new Star({stellarClass: '', stellarType: 'BD', subtype: null}, ORBIT_TYPES.PRIMARY);
    solarSystem.addPrimary(star);
  });

  afterEach(() => {
    clearCache();
  });

  it('Minimum available orbit is 0.005', function() {
    const mao = solarSystem.primaryStar.minimumAllowableOrbit;
    mao.should.equal(0.005);
  });

  it('Total Orbits', function() {
    solarSystem.determineAvailableOrbits();
    solarSystem.primaryStar.availableOrbits.should.have.lengthOf(1);
    solarSystem.primaryStar.availableOrbits[0][0].should.equal(0.005);
    solarSystem.primaryStar.availableOrbits[0][1].should.equal(20);
    const orbits = solarSystem.primaryStar.totalOrbits;
    orbits.should.equal(20);
  });

  it('Total Orbits with Companion', function() {
    ROLL_CACHE.push(3);
    ROLL_CACHE.push(6);
    addCompanion({star: solarSystem.primaryStar, unusualChance: 0});
    const companion = solarSystem.primaryStar.companion;
    solarSystem.determineAvailableOrbits();
    solarSystem.primaryStar.availableOrbits.should.have.lengthOf(1);
    solarSystem.primaryStar.availableOrbits[0][0].should.equal(0.5 + companion.eccentricity);
    solarSystem.primaryStar.availableOrbits[0][1].should.equal(20);
    const orbits = solarSystem.primaryStar.totalOrbits;
    orbits.should.equal(19);
  });


});
