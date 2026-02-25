'use strict';

const chai = require('chai');
const { ORBIT_TYPES } = require('../utils');
const { clearCache } = require('../dice');
const Star = require('../stars/star');
const PlanetoidBelt = require('../planetoidBelts/planetoidBelt');
const StellarObject = require('../stellarObject');
const OrbitSequenceAssigner = require('../stars/OrbitSequenceAssigner');

chai.should();

const makeStar = (orbitType) =>
  new Star({ stellarClass: 'V', stellarType: 'M', subtype: 5 }, orbitType);

const makeBody = (orbit, orbitType = ORBIT_TYPES.TERRESTRIAL) => {
  const body = new StellarObject();
  body.orbit = orbit;
  body.orbitType = orbitType;
  body.mass = 0;
  return body;
};

const makePlanetoidObject = (orbit, belt) => {
  const body = makeBody(orbit, ORBIT_TYPES.PLANETOID_BELT_OBJECT);
  body.belt = belt;
  return body;
};

describe('OrbitSequenceAssigner', function () {
  beforeEach(() => clearCache());

  describe('star sequences', function () {
    it('assigns A to the primary star', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      star.orbitSequence.should.equal('A');
    });

    it('assigns Ab to a companion star', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      const companion = makeStar(ORBIT_TYPES.COMPANION);
      star.companion = companion;
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      companion.orbitSequence.should.equal('Ab');
    });

    it('assigns B to a secondary star in stellarObjects', function () {
      const primary = makeStar(ORBIT_TYPES.PRIMARY);
      const secondary = makeStar(ORBIT_TYPES.CLOSE);
      secondary.orbit = 3;
      primary.addStellarObject(secondary);
      new OrbitSequenceAssigner({ primaryStar: primary }).assign();
      secondary.orbitSequence.should.equal('B');
    });
  });

  describe('non-planetoid body sequences', function () {
    it('assigns Roman numeral sequences to bodies under primary', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      const p1 = makeBody(1);
      const p2 = makeBody(2);
      const p3 = makeBody(3);
      star.addStellarObject(p1);
      star.addStellarObject(p2);
      star.addStellarObject(p3);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      p1.orbitSequence.should.equal('A I');
      p2.orbitSequence.should.equal('A II');
      p3.orbitSequence.should.equal('A III');
    });

    it('prefixes with Aab when primary has a companion', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      star.companion = makeStar(ORBIT_TYPES.COMPANION);
      const planet = makeBody(1);
      star.addStellarObject(planet);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      planet.orbitSequence.should.equal('Aab I');
    });

    it('uses combined star letters for bodies after a secondary star', function () {
      const primary = makeStar(ORBIT_TYPES.PRIMARY);
      const secondary = makeStar(ORBIT_TYPES.CLOSE);
      secondary.orbit = 3;
      const planet = makeBody(5);
      primary.addStellarObject(secondary);
      primary.addStellarObject(planet);
      new OrbitSequenceAssigner({ primaryStar: primary }).assign();
      planet.orbitSequence.should.equal('AB I');
    });

    it('assigns sequences under a secondary star', function () {
      const primary = makeStar(ORBIT_TYPES.PRIMARY);
      const secondary = makeStar(ORBIT_TYPES.CLOSE);
      secondary.orbit = 5;
      const planet = makeBody(1);
      secondary.addStellarObject(planet);
      primary.addStellarObject(secondary);
      new OrbitSequenceAssigner({ primaryStar: primary }).assign();
      planet.orbitSequence.should.equal('B I');
    });
  });

  describe('planetoid belt sequences', function () {
    it('assigns a Roman numeral sequence to a planetoid belt', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      const belt = new PlanetoidBelt(2);
      star.addStellarObject(belt);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      belt.orbitSequence.should.equal('A I');
    });

    it('assigns belt-relative numeric sequences to planetoid objects', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      const belt = new PlanetoidBelt(2);
      const obj1 = makePlanetoidObject(2.1, belt);
      const obj2 = makePlanetoidObject(2.2, belt);
      star.addStellarObject(belt);
      star.addStellarObject(obj1);
      star.addStellarObject(obj2);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      obj1.orbitSequence.should.equal('A I.1');
      obj2.orbitSequence.should.equal('A I.2');
    });

    it('numbers planetoid objects by orbit order', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      const belt = new PlanetoidBelt(2);
      const innerObj = makePlanetoidObject(2.1, belt);
      const outerObj = makePlanetoidObject(2.9, belt);
      star.addStellarObject(belt);
      star.addStellarObject(innerObj);
      star.addStellarObject(outerObj);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      innerObj.orbitSequence.should.equal('A I.1');
      outerObj.orbitSequence.should.equal('A I.2');
    });

    it('planetoid objects do not consume Roman numeral indices', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      const belt = new PlanetoidBelt(2);
      const obj = makePlanetoidObject(2.1, belt);
      const planet = makeBody(3);
      star.addStellarObject(belt);
      star.addStellarObject(obj);
      star.addStellarObject(planet);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      belt.orbitSequence.should.equal('A I');
      planet.orbitSequence.should.equal('A II');
      obj.orbitSequence.should.equal('A I.1');
    });

    it('assigns sequences to two separate belts independently', function () {
      const star = makeStar(ORBIT_TYPES.PRIMARY);
      const belt1 = new PlanetoidBelt(2);
      const belt2 = new PlanetoidBelt(5);
      const obj1 = makePlanetoidObject(2.1, belt1);
      const obj2 = makePlanetoidObject(5.1, belt2);
      const obj3 = makePlanetoidObject(5.2, belt2);
      star.addStellarObject(belt1);
      star.addStellarObject(obj1);
      star.addStellarObject(belt2);
      star.addStellarObject(obj2);
      star.addStellarObject(obj3);
      new OrbitSequenceAssigner({ primaryStar: star }).assign();
      obj1.orbitSequence.should.equal('A I.1');
      obj2.orbitSequence.should.equal('A II.1');
      obj3.orbitSequence.should.equal('A II.2');
    });

    it('assigns belt-relative sequences for planetoid objects under a secondary star', function () {
      const primary = makeStar(ORBIT_TYPES.PRIMARY);
      const secondary = makeStar(ORBIT_TYPES.CLOSE);
      secondary.orbit = 8;
      const belt = new PlanetoidBelt(2);
      const obj = makePlanetoidObject(2.1, belt);
      secondary.addStellarObject(belt);
      secondary.addStellarObject(obj);
      primary.addStellarObject(secondary);
      new OrbitSequenceAssigner({ primaryStar: primary }).assign();
      belt.orbitSequence.should.equal('B I');
      obj.orbitSequence.should.equal('B I.1');
    });
  });
});
