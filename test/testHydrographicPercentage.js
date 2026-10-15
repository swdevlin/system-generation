'use strict';

const chai = require('chai');
const determineHydrographics = require('../utils/determineHydrographics');
const SurfaceLiquidGenerator = require('../hydrographics/ExoticLiquidsGenerator');

const { hydrographicPercentage } = determineHydrographics;

chai.should();

function range(code) {
  if (code === 0) return [0, 5];
  if (code === 10) return [95, 100];
  return [code * 10 - 5, code * 10 + 4];
}

function makePlanet(overrides = {}) {
  return {
    size: 7,
    meanTemperature: 288,
    atmosphere: { code: 6, bar: 1 },
    hydrographics: { code: null, distribution: null },
    ...overrides,
  };
}

describe('hydrographic percentage', function () {
  it('stays within the range for each code', function () {
    for (let code = 0; code <= 10; code++) {
      const [min, max] = range(code);
      for (let i = 0; i < 500; i++) hydrographicPercentage(code).should.be.within(min, max);
    }
  });

  it('is computed for rolled hydrographics', function () {
    for (let i = 0; i < 200; i++) {
      const hydrographics = determineHydrographics(null, makePlanet());
      const [min, max] = range(hydrographics.code);
      hydrographics.percentage.should.be.within(min, max);
    }
  });

  it('is computed for a preset code', function () {
    const hydrographics = determineHydrographics(null, makePlanet({ hydrographics: { code: 7 } }));
    hydrographics.percentage.should.be.within(65, 74);
  });

  it('keeps a preset percentage', function () {
    const hydrographics = determineHydrographics(null, makePlanet({ hydrographics: { code: 7, percentage: 70 } }));
    hydrographics.percentage.should.equal(70);
  });

  it('is 0 for tiny worlds', function () {
    determineHydrographics(null, makePlanet({ size: 1 })).percentage.should.equal(0);
  });

  it('is 0 when the liquid boils off', function () {
    const planet = makePlanet({
      meanTemperature: 4000,
      hydrographics: { code: 7, percentage: 70, liquid: 'Water', distribution: 5 },
    });
    new SurfaceLiquidGenerator().reconcile(planet).percentage.should.equal(0);
  });
});
