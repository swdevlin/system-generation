'use strict';

const chai = require('chai');
const ClimateGenerator = require('../climate/ClimateGenerator');
const LatitudeTemperature = require('../climate/LatitudeTemperature');
const SurfaceLiquidGenerator = require('../hydrographics/ExoticLiquidsGenerator');

chai.should();

const sun = { totalLuminosity: 1, hzco: 3 };

function makePlanet(overrides = {}) {
  return {
    orbit: 3,
    size: 7,
    composition: 'Rock',
    effectiveHZCODeviation: 0,
    axialTilt: 20,
    meanTemperature: 288,
    atmosphere: { code: 6, bar: 1 },
    hydrographics: { code: 7, liquid: 'Water', distribution: 5 },
    ...overrides,
  };
}

describe('ClimateGenerator', function () {
  const generator = new ClimateGenerator();

  it('replaces the table estimate with the temperature equation', function () {
    const planet = makePlanet();
    generator.apply(sun, planet);
    planet.estimatedTemperature.should.equal(288);
    const expected = Math.round(new LatitudeTemperature(sun, planet).meanTemperature());
    planet.meanTemperature.should.equal(expected);
  });

  it('uses albedo: a brighter world is colder', function () {
    const dark = new LatitudeTemperature(sun, makePlanet({ albedo: 0.1, greenhouse: 0.5 }));
    const bright = new LatitudeTemperature(sun, makePlanet({ albedo: 0.9, greenhouse: 0.5 }));
    bright.meanTemperature().should.be.below(dark.meanTemperature());
  });

  it('UWP worlds keep their table temperature by tuning greenhouse', function () {
    for (let i = 0; i < 50; i++) {
      const planet = makePlanet({ fromUWP: true });
      generator.apply(sun, planet);
      planet.meanTemperature.should.equal(288);
      planet.greenhouse.should.be.at.least(0);
    }
  });

  it('a UWP vacuum world tunes albedo instead of greenhouse', function () {
    const planet = makePlanet({ fromUWP: true, meanTemperature: 250, atmosphere: { code: 0, bar: 0 } });
    generator.apply(sun, planet);
    planet.greenhouse.should.equal(0);
    planet.meanTemperature.should.equal(250);
  });

  it('meanTemperature at a nearer distance is hotter (periapsis)', function () {
    const planet = makePlanet({ albedo: 0.3, greenhouse: 0.5, eccentricity: 0.2 });
    generator.applyPeriapsisApoapsis(sun, planet);
    planet.periapsisTemperature.should.be.above(planet.apoapsisTemperature);
  });
});

describe('SurfaceLiquidGenerator.reconcile', function () {
  const liquids = new SurfaceLiquidGenerator();

  it('keeps a liquid that is too cold (it freezes)', function () {
    const planet = makePlanet({ meanTemperature: 150 });
    liquids.reconcile(planet).liquid.should.equal('Water');
  });

  it('re-picks a liquid that would boil, including magma on very hot worlds', function () {
    const planet = makePlanet({ meanTemperature: 1500 });
    const hydrographics = liquids.reconcile(planet);
    hydrographics.liquid.should.not.equal('Water');
    hydrographics.previousLiquid.should.equal('Water');
    const entry = SurfaceLiquidGenerator.SurfaceLiquidsTable.find((l) => l.name === hydrographics.liquid);
    (1500).should.be.within(entry.meltingPointK, entry.boilingPointK);
  });

  it('boils off when nothing is liquid', function () {
    const planet = makePlanet({ meanTemperature: 4000 });
    const hydrographics = liquids.reconcile(planet);
    hydrographics.code.should.equal(0);
    (hydrographics.liquid === null).should.equal(true);
  });

  it('leaves dry worlds alone', function () {
    const planet = makePlanet({ meanTemperature: 1500, hydrographics: { code: 0, liquid: 'Water' } });
    liquids.reconcile(planet).liquid.should.equal('Water');
  });
});