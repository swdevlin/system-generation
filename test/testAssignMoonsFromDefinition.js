'use strict';

const chai = require('chai');

const SolarSystem = require('../solarSystems/solarSystem');
const Star = require('../stars/star');
const StellarClassification = require('../stars/StellarClassification');
const { ORBIT_TYPES } = require('../utils');
const { clearCache, ROLL_CACHE } = require('../dice');
const loadPlanetsFromDefinition = require('../solarSystems/loadPlanetsFromDefinition');
const assignMoons = require('../moons/assignMoons');

chai.should();

const makeStar = () => {
  const classification = new StellarClassification();
  classification.stellarClass = 'V';
  classification.stellarType = 'G';
  classification.subtype = 0;
  return new Star(classification, ORBIT_TYPES.PRIMARY);
};

const seedDice = () => {
  for (let i = 0; i < 400; i++) ROLL_CACHE.push(4);
};

const buildSystemWithBody = (body) => {
  const solarSystem = new SolarSystem();
  const star = makeStar();
  solarSystem.addPrimary(star);
  star.availableOrbits = [[0.03, 20]];
  star.orbit = 0;

  seedDice();

  const definition = {
    primary: {
      bodies: [body],
    },
  };

  loadPlanetsFromDefinition({ definition, solarSystem });

  const created = star.stellarObjects.find((so) => so.orbitType === ORBIT_TYPES.TERRESTRIAL);
  return { solarSystem, star, created };
};

describe('assignMoonsFromDefinition (via loadPlanetsFromDefinition)', function () {
  afterEach(function () {
    clearCache();
  });

  it('moonCount adds the requested number of moons', function () {
    const { created } = buildSystemWithBody({ uwp: 'B565779-A', moonCount: 3 });
    created.moons.length.should.equal(3);
  });

  it('ringCount adds the requested number of rings', function () {
    const { created } = buildSystemWithBody({ uwp: 'B565779-A', ringCount: 2 });
    created.moons.length.should.equal(0);
    created.rings.length.should.equal(2);
    created.rings.every((r) => typeof r.centreLocation === 'number').should.be.true;
    created.rings.every((r) => typeof r.span === 'number').should.be.true;
  });

  it('moons list honours ring, small moon, literal uwp, and random entries', function () {
    const { created } = buildSystemWithBody({
      uwp: 'B565779-A',
      moons: [{ uwp: 'ring' }, { uwp: 'small moon' }, { uwp: 'C311396-9' }, { uwp: 'random' }],
    });

    created.rings.length.should.equal(1);
    created.moons.length.should.equal(3);
    const smalls = created.moons.filter((m) => m.size === 'S');
    const fromUwp = created.moons.filter((m) => m.fromUWP);

    fromUwp.length.should.equal(1);
    fromUwp[0].size.should.equal(3);
    // the small-moon entry and the random entry may coincidentally both roll 'S',
    // but at minimum the explicit small-moon entry must be present
    smalls.length.should.be.at.least(1);
  });

  it('moons list overrides moonCount and ringCount when both are present', function () {
    const { created } = buildSystemWithBody({
      uwp: 'B565779-A',
      moonCount: 10,
      ringCount: 10,
      moons: [{ uwp: 'ring' }],
    });

    created.moons.length.should.equal(0);
    created.rings.length.should.equal(1);
  });

  it('does not re-roll moons via the dice-based assignMoons pass', function () {
    const { star, created } = buildSystemWithBody({
      uwp: 'B565779-A',
      moonCount: 2,
    });

    created.moonsFromDefinition.should.be.true;
    assignMoons(star);
    created.moons.length.should.equal(2);
  });
});
