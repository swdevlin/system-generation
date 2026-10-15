'use strict';

const chai = require('chai');
const LatitudeTemperature = require('../climate/LatitudeTemperature');
const IceCapGenerator = require('../climate/IceCapGenerator');
const orbitToAU = require('../utils/orbitToAU');

chai.should();

const sun = { totalLuminosity: 1, hzco: 3 };

function makePlanet(overrides = {}) {
  return {
    orbit: 3,
    albedo: 0.3,
    greenhouse: 0.5,
    axialTilt: 23.4,
    atmosphere: { code: 6, bar: 1 },
    hydrographics: { code: 7, liquid: 'Water' },
    ...overrides,
  };
}

describe('LatitudeTemperature', function () {
  it('orbit 3 is 1 AU', function () {
    orbitToAU(3).should.be.closeTo(1, 0.001);
  });

  it('45° temperature equals the plain temperature equation', function () {
    const planet = makePlanet({ axialTilt: 0 });
    const au = orbitToAU(planet.orbit);
    const expected =
      279 * ((sun.totalLuminosity * (1 - planet.albedo) * (1 + planet.greenhouse)) / au ** 2) ** 0.25;
    new LatitudeTemperature(sun, planet).temperatureAt(45).should.be.closeTo(expected, 1e-9);
  });

  it('is constant within the tropical zone and falls toward the poles', function () {
    const lt = new LatitudeTemperature(sun, makePlanet());
    lt.temperatureAt(0).should.equal(lt.temperatureAt(20));
    let previous = Infinity;
    for (let lat = 0; lat <= 90; lat += 5) {
      lt.temperatureAt(lat).should.be.at.most(previous);
      previous = lt.temperatureAt(lat);
    }
    lt.temperatureAt(90).should.be.below(lt.temperatureAt(45));
  });

  it('a thicker atmosphere evens out pole/equator differences', function () {
    const thin = new LatitudeTemperature(sun, makePlanet({ atmosphere: { code: 4, bar: 0.5 } }));
    const thick = new LatitudeTemperature(sun, makePlanet({ atmosphere: { code: 8, bar: 2 } }));
    const spread = (lt) => lt.temperatureAt(0) - lt.temperatureAt(90);
    spread(thick).should.be.below(spread(thin));
  });

  it('normalises negative and >90° tilts', function () {
    LatitudeTemperature.normaliseTilt(-30).should.equal(30);
    LatitudeTemperature.normaliseTilt(120).should.equal(60);
    LatitudeTemperature.normaliseTilt(180).should.equal(0);
  });

  it('uses the arctic edge (90° - tilt) as the equatorial band for tilts >= 45°', function () {
    const lt = new LatitudeTemperature(sun, makePlanet({ axialTilt: 120 }));
    lt.zoneBoundary.should.equal(30);
    lt.temperatureAt(0).should.equal(lt.temperatureAt(30));
    lt.temperatureAt(31).should.be.below(lt.temperatureAt(30));
  });

  it('latitudeAtTemperature inverts temperatureAt', function () {
    const lt = new LatitudeTemperature(sun, makePlanet());
    for (const lat of [30, 45, 60, 75, 89]) lt.latitudeAtTemperature(lt.temperatureAt(lat)).should.be.closeTo(lat, 1e-6);
  });

  it('falls back to luminosity derived from hzco', function () {
    LatitudeTemperature.starLuminosity({ hzco: 3 }).should.be.closeTo(1, 0.001);
  });

  it('produces a latitude table', function () {
    const table = new LatitudeTemperature(sun, makePlanet()).table();
    table.map((r) => r.latitude).should.deep.equal([0, 15, 30, 45, 60, 75, 90]);
  });
});

describe('IceCapGenerator', function () {
  const generator = new IceCapGenerator();

  it('gives plausible polar caps for an Earth-like world', function () {
    const caps = generator.generate(sun, makePlanet());
    caps.meltingPointK.should.equal(273);
    caps.edgeTemperatureK.should.equal(263);
    caps.edgeLatitude.should.be.within(45, 89);
    caps.coverage.should.be.within(0, 0.3);
  });

  it('no caps on a dry world', function () {
    const caps = generator.generate(sun, makePlanet({ hydrographics: { code: 0, liquid: null } }));
    caps.coverage.should.equal(0);
    (caps.edgeLatitude === null).should.equal(true);
  });

  it('fully frozen when very cold', function () {
    const caps = generator.generate(sun, makePlanet({ orbit: 6 }));
    caps.edgeLatitude.should.equal(0);
    caps.coverage.should.equal(1);
  });

  it('no caps when hot', function () {
    const caps = generator.generate(sun, makePlanet({ orbit: 2 }));
    (caps.edgeLatitude === null).should.equal(true);
    caps.coverage.should.equal(0);
  });

  it('uses the melting point of an exotic liquid', function () {
    const caps = generator.generate(sun, makePlanet({ hydrographics: { code: 5, liquid: 'Hydrogen Cyanide' } }));
    caps.meltingPointK.should.equal(260);
  });

  it('places the edge 10 K below the melting point', function () {
    const planet = makePlanet();
    const lt = new LatitudeTemperature(sun, planet);
    const caps = generator.generate(sun, planet, lt);
    lt.temperatureAt(caps.edgeLatitude).should.be.closeTo(263, 0.1);
  });

  it('freeze offset can be changed', function () {
    const planet = makePlanet();
    const lt = new LatitudeTemperature(sun, planet);
    const caps = new IceCapGenerator(0).generate(sun, planet, lt);
    caps.edgeTemperatureK.should.equal(273);
    lt.temperatureAt(caps.edgeLatitude).should.be.closeTo(273, 0.1);
  });

  it('freeze offset is read from ICE_CAP_FREEZE_OFFSET', function () {
    const previous = process.env.ICE_CAP_FREEZE_OFFSET;
    process.env.ICE_CAP_FREEZE_OFFSET = '5';
    try {
      new IceCapGenerator().freezeOffsetK.should.equal(5);
    } finally {
      if (previous === undefined) delete process.env.ICE_CAP_FREEZE_OFFSET;
      else process.env.ICE_CAP_FREEZE_OFFSET = previous;
    }
  });

  it('notes tidally locked worlds', function () {
    const caps = generator.generate(sun, makePlanet({ tidalLock: '1:1' }));
    caps.note.should.match(/Tidally locked/);
  });
});