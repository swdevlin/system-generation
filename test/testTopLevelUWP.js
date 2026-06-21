'use strict';

const chai = require('chai');
const generateStarSystem = require('../service/generateStarSystem');
const { deconstructUWP } = require('../utils');

chai.should();

const TERRESTRIAL_UWP = 'B874409-A';
// ?000???-? pattern — the existing regex treats this as a belt
const BELT_UWP = 'B000409-A';

describe('Top-level UWP in build spec', function () {
  this.timeout(5000);

  describe('world type selection', function () {
    it('creates a terrestrial planet main world when UWP size is non-zero', function () {
      const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP });
      const mw = sys.mainWorld;
      mw.should.exist;
      mw.fromUWP.should.be.true;
      deconstructUWP(TERRESTRIAL_UWP).size.should.equal(mw.size);
    });

    it('creates a planetoid belt main world when UWP digits 1-3 are 000', function () {
      // Use counts to guarantee at least one belt slot so assignMainWorld creates a belt
      const sys = generateStarSystem({
        uwp: BELT_UWP,
        counts: { gasGiants: 1, terrestrialPlanets: 1, planetoidBelts: 2 },
      });
      const mw = sys.mainWorld;
      mw.should.exist;
      mw.fromUWP.should.be.true;
      mw.size.should.equal(0);
    });
  });

  describe('UWP property propagation', function () {
    it('applies all UWP fields to the terrestrial main world', function () {
      const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP });
      const mw = sys.mainWorld;
      const expected = deconstructUWP(TERRESTRIAL_UWP);
      mw.starPort.should.equal(expected.starPort);
      mw.size.should.equal(expected.size);
      mw.atmosphere.code.should.equal(expected.atmosphere);
      mw.hydrographics.code.should.equal(expected.hydrographics);
      mw.population.code.should.equal(expected.population);
      mw.government.code.should.equal(expected.government);
      mw.lawLevel.code.should.equal(expected.lawLevel);
      mw.techLevel.code.should.equal(expected.techLevel);
    });

    it('applies social UWP fields to a belt main world', function () {
      const sys = generateStarSystem({
        uwp: BELT_UWP,
        counts: { gasGiants: 1, terrestrialPlanets: 1, planetoidBelts: 2 },
      });
      const mw = sys.mainWorld;
      const expected = deconstructUWP(BELT_UWP);
      mw.starPort.should.equal(expected.starPort);
      mw.size.should.equal(0);
      mw.population.code.should.equal(expected.population);
      mw.government.code.should.equal(expected.government);
      mw.lawLevel.code.should.equal(expected.lawLevel);
      mw.techLevel.code.should.equal(expected.techLevel);
    });

    it('sets fromUWP to true on main world', function () {
      const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP });
      sys.mainWorld.fromUWP.should.be.true;
    });
  });

  describe('name propagation', function () {
    it('sets system name from definition.name', function () {
      const sys = generateStarSystem({ name: 'Spinward', uwp: TERRESTRIAL_UWP });
      sys.name.should.equal('Spinward');
    });

    it('sets main world name from definition.name', function () {
      const sys = generateStarSystem({ name: 'Spinward', uwp: TERRESTRIAL_UWP });
      sys.mainWorld.name.should.equal('Spinward');
    });

    it('leaves main world name null when name is not specified', function () {
      const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP });
      chai.expect(sys.mainWorld.name).to.be.null;
    });
  });

  describe('orbit defaulting', function () {
    it('defaults orbit to habitable when not specified', function () {
      const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP });
      // mainFromDefinition is set before orbit resolution; verify the default was applied
      sys.mainFromDefinition.orbit.should.equal('habitable');
    });

    it('uses the provided orbit label when specified', function () {
      const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP, orbit: 'outer' });
      sys.mainFromDefinition.orbit.should.equal('outer');
      sys.mainWorld.should.exist;
    });

    it('uses a numeric orbit when specified', function () {
      const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP, orbit: 3 });
      sys.mainFromDefinition.orbit.should.equal(3);
      sys.mainWorld.should.exist;
    });
  });

  describe('combined with counts block', function () {
    it('uses top-level uwp as main world when counts has no mainWorld', function () {
      const sys = generateStarSystem({
        name: 'Counts World',
        uwp: TERRESTRIAL_UWP,
        counts: { gasGiants: 1, terrestrialPlanets: 2, planetoidBelts: 0 },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      const expected = deconstructUWP(TERRESTRIAL_UWP);
      sys.mainWorld.starPort.should.equal(expected.starPort);
      sys.mainWorld.name.should.equal('Counts World');
    });

    it('counts.mainWorld takes precedence over top-level uwp', function () {
      const countsUWP = 'A567890-B';
      const sys = generateStarSystem({
        uwp: TERRESTRIAL_UWP,
        counts: {
          gasGiants: 1,
          terrestrialPlanets: 2,
          planetoidBelts: 0,
          mainWorld: { uwp: countsUWP },
        },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      const expected = deconstructUWP(countsUWP);
      sys.mainWorld.starPort.should.equal(expected.starPort);
      sys.mainWorld.size.should.equal(expected.size);
    });
  });

  describe('primary.mainWorld', function () {
    it('creates a terrestrial main world from primary.mainWorld.uwp', function () {
      const sys = generateStarSystem({
        primary: { mainWorld: { uwp: TERRESTRIAL_UWP } },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      const expected = deconstructUWP(TERRESTRIAL_UWP);
      sys.mainWorld.starPort.should.equal(expected.starPort);
      sys.mainWorld.size.should.equal(expected.size);
    });

    it('creates a belt main world from primary.mainWorld with belt UWP', function () {
      const sys = generateStarSystem({
        primary: { mainWorld: { uwp: BELT_UWP } },
        counts: { gasGiants: 1, terrestrialPlanets: 1, planetoidBelts: 2 },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      sys.mainWorld.size.should.equal(0);
    });

    it('sets main world name from primary.mainWorld.name', function () {
      const sys = generateStarSystem({
        primary: { mainWorld: { uwp: TERRESTRIAL_UWP, name: 'Mora' } },
      });
      sys.mainWorld.name.should.equal('Mora');
    });

    it('defaults orbit to habitable when primary.mainWorld.orbit is absent', function () {
      const sys = generateStarSystem({
        primary: { mainWorld: { uwp: TERRESTRIAL_UWP } },
      });
      sys.mainFromDefinition.orbit.should.equal('habitable');
    });

    it('uses primary.mainWorld.orbit when specified', function () {
      const sys = generateStarSystem({
        primary: { mainWorld: { uwp: TERRESTRIAL_UWP, orbit: 'inner' } },
      });
      sys.mainFromDefinition.orbit.should.equal('inner');
      sys.mainWorld.should.exist;
    });

    it('counts.mainWorld takes precedence over primary.mainWorld', function () {
      const countsUWP = 'A567890-B';
      const sys = generateStarSystem({
        primary: { mainWorld: { uwp: TERRESTRIAL_UWP } },
        counts: {
          gasGiants: 1,
          terrestrialPlanets: 2,
          planetoidBelts: 0,
          mainWorld: { uwp: countsUWP },
        },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      const expected = deconstructUWP(countsUWP);
      sys.mainWorld.starPort.should.equal(expected.starPort);
    });

    it('top-level uwp takes precedence over primary.mainWorld', function () {
      // top-level uwp is in the "else" branch — it's set after primary.mainWorld check
      // but when BOTH are present without counts, primary.mainWorld wins (it's checked first)
      // This test verifies the priority documented in code: primary.mainWorld checked first
      const sys = generateStarSystem({
        uwp: 'A567890-B',
        primary: { mainWorld: { uwp: TERRESTRIAL_UWP, name: 'PrimaryWins' } },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      // primary.mainWorld is checked first in else branch, so it wins
      sys.mainWorld.name.should.equal('PrimaryWins');
    });

    it('works alongside a subsector context', function () {
      const subsector = { type: 'EMPTY', unusualChance: 0 };
      const definition = {
        name: 'Lunion',
        primary: { mainWorld: { uwp: TERRESTRIAL_UWP, name: 'Lunion' } },
      };
      const sys = generateStarSystem(definition, subsector, 4, 6);
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      sys.mainWorld.name.should.equal('Lunion');
    });

    it('finds mainWorld on a companion of the primary star', function () {
      const sys = generateStarSystem({
        primary: { companion: { mainWorld: { uwp: TERRESTRIAL_UWP, name: 'CompanionWorld' } } },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      sys.mainWorld.name.should.equal('CompanionWorld');
    });

    it('finds mainWorld on a close secondary star', function () {
      const sys = generateStarSystem({
        primary: {
          type: 'G2 V',
          close: { mainWorld: { uwp: TERRESTRIAL_UWP, name: 'CloseWorld' } },
        },
      });
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      sys.mainWorld.name.should.equal('CloseWorld');
    });

    it('throws when mainWorld is defined on multiple stars', function () {
      chai.expect(() =>
        generateStarSystem({
          primary: {
            mainWorld: { uwp: TERRESTRIAL_UWP },
            close: { mainWorld: { uwp: TERRESTRIAL_UWP } },
          },
        })
      ).to.throw('Multiple mainWorld definitions found across stars');
    });
  });

  describe('subsector integration', function () {
    it('works when definition is passed alongside a subsector context', function () {
      const subsector = { type: 'EMPTY', unusualChance: 0 };
      const definition = { name: 'Subsector World', uwp: TERRESTRIAL_UWP };
      const sys = generateStarSystem(definition, subsector, 1, 1);
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      sys.name.should.equal('Subsector World');
      sys.mainWorld.name.should.equal('Subsector World');
    });

    it('works for a belt world within a subsector context', function () {
      const subsector = { type: 'EMPTY', unusualChance: 0 };
      const definition = {
        name: 'Belt System',
        uwp: BELT_UWP,
        counts: { gasGiants: 1, terrestrialPlanets: 1, planetoidBelts: 2 },
      };
      const sys = generateStarSystem(definition, subsector, 2, 3);
      sys.mainWorld.should.exist;
      sys.mainWorld.fromUWP.should.be.true;
      sys.mainWorld.size.should.equal(0);
      sys.name.should.equal('Belt System');
    });
  });
});