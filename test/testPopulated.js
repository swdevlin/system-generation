'use strict';

const chai = require('chai');
chai.should();

const Populated = require('../solarSystems/populated');

describe('Populated', function () {
  describe('no spec', function () {
    it('returns null zone when constructed with undefined', function () {
      const p = new Populated(undefined);
      (p.getAllegiance(0, 0) === null).should.be.true;
    });

    it('returns null zone when constructed with null', function () {
      const p = new Populated(null);
      (p.getAllegiance(0, 0) === null).should.be.true;
    });

    it('returns null zone when constructed with false', function () {
      const p = new Populated(false);
      (p.getAllegiance(0, 0) === null).should.be.true;
    });
  });

  describe('boolean true', function () {
    it('returns a zone with all defaults', function () {
      const zone = new Populated(true).getAllegiance(0, 0);
      zone.minTechLevel.should.equal(0);
      zone.maxTechLevel.should.equal(16);
      zone.minPopulationCode.should.equal(0);
      zone.maxPopulationCode.should.equal(15);
      zone.populationDM.should.equal(0);
      (zone.allegiance === null).should.be.true;
    });
  });

  describe('empty object', function () {
    it('returns a zone with all defaults', function () {
      const zone = new Populated({}).getAllegiance(0, 0);
      zone.minTechLevel.should.equal(0);
      zone.maxTechLevel.should.equal(16);
      zone.minPopulationCode.should.equal(0);
      zone.maxPopulationCode.should.equal(15);
      zone.populationDM.should.equal(0);
      (zone.allegiance === null).should.be.true;
    });
  });

  describe('partial spec (no type)', function () {
    it('uses provided minTechLevel and defaults the rest', function () {
      const zone = new Populated({ minTechLevel: 5 }).getAllegiance(0, 0);
      zone.minTechLevel.should.equal(5);
      zone.maxTechLevel.should.equal(16);
    });

    it('uses provided maxTechLevel', function () {
      const zone = new Populated({ maxTechLevel: 12 }).getAllegiance(0, 0);
      zone.maxTechLevel.should.equal(12);
    });

    it('uses provided population code range', function () {
      const zone = new Populated({ minPopulationCode: 3, maxPopulationCode: 8 }).getAllegiance(0, 0);
      zone.minPopulationCode.should.equal(3);
      zone.maxPopulationCode.should.equal(8);
    });

    it('uses provided populationDM', function () {
      const zone = new Populated({ populationDM: 2 }).getAllegiance(0, 0);
      zone.populationDM.should.equal(2);
    });

    it('uses provided allegiance', function () {
      const zone = new Populated({ allegiance: 'ImSy' }).getAllegiance(0, 0);
      zone.allegiance.should.equal('ImSy');
    });

    it('applies all provided fields together', function () {
      const zone = new Populated({
        minTechLevel: 5,
        maxTechLevel: 12,
        minPopulationCode: 3,
        maxPopulationCode: 9,
        populationDM: 1,
        allegiance: 'ImSy',
      }).getAllegiance(0, 0);
      zone.minTechLevel.should.equal(5);
      zone.maxTechLevel.should.equal(12);
      zone.minPopulationCode.should.equal(3);
      zone.maxPopulationCode.should.equal(9);
      zone.populationDM.should.equal(1);
      zone.allegiance.should.equal('ImSy');
    });
  });
});
