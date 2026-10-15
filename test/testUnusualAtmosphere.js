'use strict';

const chai = require('chai');
const UnusualAtmosphereGenerator = require('../atmosphere/UnusualAtmosphereGenerator');
const Atmosphere = require('../atmosphere/Atmosphere');
const assignAtmosphere = require('../atmosphere/assignAtmosphere');
const calculateGreenhouse = require('../atmosphere/calculateGreenhouse');
const determineHydrographics = require('../utils/determineHydrographics');

chai.should();

function makePlanet({ gravity = 1, hydro = null } = {}) {
  return {
    size: 7,
    gravity,
    atmosphere: new Atmosphere(),
    hydrographics: { code: hydro },
  };
}

describe('UnusualAtmosphereGenerator', function () {
  const generator = new UnusualAtmosphereGenerator();

  it('always produces a subtype with a positive pressure', function () {
    for (let i = 0; i < 500; i++) {
      const planet = makePlanet();
      generator.generate(null, planet);
      planet.atmosphere.code.should.equal(15);
      planet.atmosphere.subtype.should.be.a('string');
      planet.atmosphere.bar.should.be.above(0);
    }
  });

  it('pressure falls within the subtype range', function () {
    const byCode = {};
    for (const s of Object.values(UnusualAtmosphereGenerator.SUBTYPES)) if (s.code) byCode[s.code] = s;
    for (let i = 0; i < 500; i++) {
      const planet = makePlanet();
      generator.generate(null, planet);
      const codes = planet.atmosphere.subtype.split('+');
      if (codes.length !== 1) continue;
      const { min, max } = byCode[codes[0]].bar;
      planet.atmosphere.bar.should.be.within(min, max);
    }
  });

  it('never rolls Layered when gravity is 1.2 or less', function () {
    for (let i = 0; i < 500; i++) {
      const planet = makePlanet({ gravity: 1.2 });
      generator.generate(null, planet);
      planet.atmosphere.subtype.split('+').should.not.include('6');
    }
  });

  it('respects known hydrographics for Panthalassic and Steam', function () {
    for (let i = 0; i < 500; i++) {
      const planet = makePlanet({ hydro: 4 });
      generator.generate(null, planet);
      const codes = planet.atmosphere.subtype.split('+');
      codes.should.not.include('7');
      codes.should.not.include('8');
    }
  });

  it('combinations never pair two dense subtypes or repeat one', function () {
    const dense = UnusualAtmosphereGenerator.DENSE_CODES;
    for (let i = 0; i < 1000; i++) {
      const planet = makePlanet({ gravity: 2 });
      generator.generate(null, planet);
      const codes = planet.atmosphere.subtype.split('+');
      if (codes.length < 2) continue;
      codes[0].should.not.equal(codes[1]);
      codes.filter((c) => dense.includes(c)).length.should.be.at.most(1);
    }
  });

  it('forces hydrographics when Panthalassic sets a minimum', function () {
    const planet = makePlanet();
    planet.atmosphere.code = 15;
    planet.atmosphere.minHydrographics = 10;
    determineHydrographics(null, planet).code.should.equal(10);
  });

  it('assignAtmosphere keeps the subtype pressure and greenhouse is no longer zero', function () {
    const planet = makePlanet();
    planet.atmosphere.code = 15;
    assignAtmosphere(null, planet);
    planet.atmosphere.bar.should.be.above(0);
    calculateGreenhouse(planet).should.be.above(0);
  });
});