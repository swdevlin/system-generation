'use strict';

const chai = require('chai');

const SolarSystem = require('../solarSystems/solarSystem');
const Star = require('../stars/star');
const StellarClassification = require('../stars/StellarClassification');
const { ORBIT_TYPES } = require('../utils');
const { clearCache, ROLL_CACHE } = require('../dice');
const loadPlanetsFromDefinition = require('../solarSystems/loadPlanetsFromDefinition');

chai.should();

const makeStar = () => {
  const classification = new StellarClassification();
  classification.stellarClass = 'V';
  classification.stellarType = 'G';
  classification.subtype = 0;
  return new Star(classification, ORBIT_TYPES.PRIMARY);
};

describe('loadPlanetsFromDefinition', function () {
  afterEach(function () {
    clearCache();
  });

  it('copies populationDigit from a bodies[] entry onto the created stellar object', function () {
    const solarSystem = new SolarSystem();
    const star = makeStar();
    solarSystem.addPrimary(star);
    star.availableOrbits = [[0.03, 20]];
    star.orbit = 0;

    for (let i = 0; i < 60; i++) ROLL_CACHE.push(4);

    const definition = {
      primary: {
        bodies: [{ uwp: 'B565779-A', populationDigit: 7 }],
      },
    };

    loadPlanetsFromDefinition({ definition, solarSystem });

    const created = star.stellarObjects.find(
      (so) => so.orbitType === ORBIT_TYPES.TERRESTRIAL
    );
    chai.expect(created).to.exist;
    created.populationDigit.should.equal(7);
  });

  it('defaults populationDigit to null when not specified on the body config', function () {
    const solarSystem = new SolarSystem();
    const star = makeStar();
    solarSystem.addPrimary(star);
    star.availableOrbits = [[0.03, 20]];
    star.orbit = 0;

    for (let i = 0; i < 60; i++) ROLL_CACHE.push(4);

    const definition = {
      primary: {
        bodies: [{ uwp: 'B565779-A' }],
      },
    };

    loadPlanetsFromDefinition({ definition, solarSystem });

    const created = star.stellarObjects.find(
      (so) => so.orbitType === ORBIT_TYPES.TERRESTRIAL
    );
    chai.expect(created).to.exist;
    chai.expect(created.populationDigit).to.be.null;
  });
});
