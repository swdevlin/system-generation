const chai = require('chai');
chai.should();

const { ROLL_CACHE, clearCache } = require('../dice');
const { ExoticAtmosphereGenerator } = require('../utils/ExoticAtmosphereGenerator');
const { CorrosiveAtmosphereGenerator } = require('../utils/CorrosiveAtmosphereGenerator');
const { InsidiousAtmosphereGenerator } = require('../utils/InsidiousAtmosphereGenerator');

describe('AtmosphereGenerator Classes', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('Construction', () => {
    it('ExoticAtmosphereGenerator can be instantiated', () => {
      const table = new ExoticAtmosphereGenerator();
      table.label.should.equal('Exotic (A)');
    });

    it('CorrosiveAtmosphereGenerator can be instantiated', () => {
      const table = new CorrosiveAtmosphereGenerator();
      table.label.should.equal('Corrosive (B)');
    });

    it('InsidiousAtmosphereGenerator can be instantiated', () => {
      const table = new InsidiousAtmosphereGenerator();
      table.label.should.equal('Insidious (C)');
    });
  });

  describe('roll()', () => {
    const table = new CorrosiveAtmosphereGenerator();

    it('returns a single-element array with a gas name', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], hydrographics: 0 };
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(4);
      const result = table.roll(planet);
      result.should.be.an('array').with.lengthOf(1);
      result[0].should.be.a('string');
    });

    it('selects boiling band for temperature > 453', () => {
      const planet = { meanTemperature: 500, size: 8, buildLog: [] };
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(1);
      table.roll(planet);
      planet.buildLog[0].should.have.property('Assign Boiling Atmosphere Gas Mix');
    });

    it('selects temperate band for temperature 273-302', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], hydrographics: 0 };
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(4);
      table.roll(planet);
      planet.buildLog[0].should.have.property('Assign Temperate Atmosphere Gas Mix');
    });

    it('selects deep frozen band for temperature < 123', () => {
      const planet = { meanTemperature: 100, size: 8, buildLog: [], hydrographics: 0 };
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(3);
      table.roll(planet);
      planet.buildLog[0].should.have.property('Assign Frozen Atmosphere Gas Mix');
    });

    it('applies DM for small size', () => {
      const normalPlanet = { meanTemperature: 290, size: 8, buildLog: [], hydrographics: 0 };
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(1);
      const normalResult = table.roll(normalPlanet);

      const smallPlanet = { meanTemperature: 290, size: 5, buildLog: [], hydrographics: 0 };
      ROLL_CACHE.push(1);
      ROLL_CACHE.push(1);
      const smallResult = table.roll(smallPlanet);

      // Same raw roll but different DM should give different results
      // Normal size 8: DM 0, roll 2 => 'Chlorine'
      // Small size 5: DM -1, roll 1 => 'Krypton' (min floor)
      normalResult[0].should.equal('Chlorine');
      smallResult[0].should.equal('Krypton');
    });

    it('clamps to min floor when roll is below minimum', () => {
      // Boiling band with extreme negative DM
      const planet = { meanTemperature: 3000, size: 5, buildLog: [] };
      // DM = -5 (temp > 2000) + -1 (size 5) = -6
      // Raw roll 4, total = -2 (exactly the min)
      ROLL_CACHE.push(2);
      ROLL_CACHE.push(2);
      const result = table.roll(planet);
      result[0].should.equal('Silicates (SO, SO2)');
    });

    it('returns overflow gas when roll exceeds table maximum', () => {
      // Deep frozen band, large planet
      const planet = { meanTemperature: 50, size: 12, buildLog: [], hydrographics: 0 };
      // DM = +5 (temp < 70) + 1 (size 12) = +6
      // Raw roll 12, total = 18 (well above table max of 10)
      ROLL_CACHE.push(6);
      ROLL_CACHE.push(6);
      const result = table.roll(planet);
      result[0].should.equal('Hydrogen');
    });

    it('populates buildLog with roll details', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], hydrographics: 0 };
      ROLL_CACHE.push(3);
      ROLL_CACHE.push(4);
      table.roll(planet);
      planet.buildLog.should.have.lengthOf(1);
      const entry = planet.buildLog[0]['Assign Temperate Atmosphere Gas Mix'];
      entry.should.have.property('column', 'Corrosive (B)');
      entry.should.have.property('dm');
      entry.roll.should.have.property('raw');
      entry.roll.should.have.property('total');
      entry.result.gases.should.be.an('array').with.lengthOf(1);
    });
  });

  describe('roll() smoke tests for all subclasses', () => {
    const tables = [
      new ExoticAtmosphereGenerator(),
      new CorrosiveAtmosphereGenerator(),
      new InsidiousAtmosphereGenerator(),
    ];

    const bands = [
      { temp: 500, label: 'boiling' },
      { temp: 400, label: 'boilingWarm' },
      { temp: 320, label: 'hot' },
      { temp: 290, label: 'temperate' },
      { temp: 250, label: 'cold' },
      { temp: 170, label: 'frozen' },
      { temp: 100, label: 'deepFrozen' },
    ];

    tables.forEach((table) => {
      bands.forEach(({ temp, label }) => {
        it(`${table.label} returns a gas for ${label} band`, () => {
          const planet = { meanTemperature: temp, size: 8, buildLog: [], hydrographics: 0 };
          ROLL_CACHE.push(3);
          ROLL_CACHE.push(4);
          const result = table.roll(planet);
          result.should.be.an('array').with.lengthOf(1);
          result[0].should.be.a('string').with.length.greaterThan(0);
        });
      });
    });
  });

  describe('buildMix()', () => {
    const table = new CorrosiveAtmosphereGenerator();

    it('returns an array of { gas, percentage } objects', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], atmosphere: {}, hydrographics: 0 };
      // Alternate dice to get different gases so they don't merge
      const dice = [1, 1, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 6, 6];
      dice.forEach((d) => ROLL_CACHE.push(d));
      const result = table.buildMix(planet);
      result.should.be.an('array');
      result.length.should.be.at.least(2);
      result[0].should.have.property('gas');
      result[0].should.have.property('percentage');
    });

    it('produces percentages that sum to at least 95', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], atmosphere: {}, hydrographics: 0 };
      for (let i = 0; i < 20; i++) ROLL_CACHE.push(3);
      const result = table.buildMix(planet);
      const total = result.reduce((sum, g) => sum + g.percentage, 0);
      total.should.be.at.least(95);
    });

    it('logs Gas Mix Determination to buildLog', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], atmosphere: {}, hydrographics: 0 };
      for (let i = 0; i < 20; i++) ROLL_CACHE.push(3);
      table.buildMix(planet);
      const mixLog = planet.buildLog.find((e) => e['Gas Mix Determination']);
      mixLog.should.exist;
      mixLog['Gas Mix Determination'].should.have.property('rolls');
      mixLog['Gas Mix Determination'].should.have.property('result');
    });
  });

  describe('assignAtmosphereComposition()', () => {
    const table = new CorrosiveAtmosphereGenerator();

    it('sets planet.atmosphere.gases', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], atmosphere: {}, hydrographics: 0 };
      // Alternate dice to get different gases
      const dice = [1, 1, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 6, 6];
      dice.forEach((d) => ROLL_CACHE.push(d));
      table.assignAtmosphereComposition(planet);
      planet.atmosphere.gases.should.be.an('array');
      planet.atmosphere.gases.length.should.be.at.least(2);
      planet.atmosphere.gases[0].should.have.property('gas');
      planet.atmosphere.gases[0].should.have.property('percentage');
    });

    it('sets planet.atmosphere.composition as a formatted string', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], atmosphere: {}, hydrographics: 0 };
      for (let i = 0; i < 20; i++) ROLL_CACHE.push(3);
      table.assignAtmosphereComposition(planet);
      planet.atmosphere.composition.should.be.a('string');
      planet.atmosphere.composition.should.match(/\(\d+%\)/);
    });

    it('composition string matches gases array', () => {
      const planet = { meanTemperature: 290, size: 8, buildLog: [], atmosphere: {}, hydrographics: 0 };
      for (let i = 0; i < 20; i++) ROLL_CACHE.push(4);
      table.assignAtmosphereComposition(planet);
      const expected = planet.atmosphere.gases
        .map((g) => `${g.gas} (${g.percentage}%)`)
        .join(', ');
      planet.atmosphere.composition.should.equal(expected);
    });
  });
});
