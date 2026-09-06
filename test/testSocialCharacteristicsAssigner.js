'use strict';

const chai = require('chai');
const SocialCharacteristicsAssigner = require('../solarSystems/SocialCharacteristicsAssigner');
const { clearCache } = require('../dice');

chai.should();

function makeAssigner(spec) {
  const world = { population: {}, government: {}, lawLevel: {} };
  return { assigner: new SocialCharacteristicsAssigner(world, {}, spec, {}), world };
}

describe('SocialCharacteristicsAssigner', function () {
  beforeEach(() => {
    clearCache();
  });

  describe('assignPopulation', function () {
    it('forces an exact code when min equals max', function () {
      const { assigner, world } = makeAssigner({ population: { min: 6, max: 6 } });
      assigner.assignPopulation();
      world.population.code.should.equal(6);
    });

    it('stays within min/max across many rolls', function () {
      for (let i = 0; i < 200; i++) {
        const { assigner, world } = makeAssigner({ population: { min: 5, max: 8 } });
        assigner.assignPopulation();
        world.population.code.should.be.within(5, 8);
      }
    });

    it('rolls freely across the natural 0-10 range when unconstrained', function () {
      for (let i = 0; i < 200; i++) {
        const { assigner, world } = makeAssigner({ population: {} });
        assigner.assignPopulation();
        world.population.code.should.be.within(0, 10);
      }
    });
  });

  describe('assignLawLevel', function () {
    it('assigns a fixed numeric law level directly', function () {
      const { assigner, world } = makeAssigner({ lawLevel: 4 });
      world.government.code = 3;
      assigner.assignLawLevel();
      world.lawLevel.code.should.equal(4);
    });

    it('stays within min/max across many rolls', function () {
      for (let i = 0; i < 200; i++) {
        const { assigner, world } = makeAssigner({ lawLevel: { min: 3, max: 7 } });
        world.government.code = 5;
        assigner.assignLawLevel();
        world.lawLevel.code.should.be.within(3, 7);
      }
    });

    it('never goes below 0 when unconstrained and government code is low', function () {
      for (let i = 0; i < 200; i++) {
        const { assigner, world } = makeAssigner({});
        world.government.code = 0;
        assigner.assignLawLevel();
        world.lawLevel.code.should.be.at.least(0);
      }
    });
  });
});
