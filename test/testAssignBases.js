'use strict';

const chai = require('chai');
chai.should();

const SolarSystem = require('../solarSystems/solarSystem');
const generateStarSystem = require('../solarSystems/generateStarSystem');
const { clearCache, ROLL_CACHE } = require('../dice');

const TERRESTRIAL_UWP = 'B874409-A';

describe('SolarSystem.assignBases', function () {
  beforeEach(function () {
    clearCache();
  });

  it('rolls bases from the main world starport when none was specified', function () {
    const sys = new SolarSystem('Test');
    sys._mainWorld = { starPort: 'A' };
    ROLL_CACHE.push(6, 6); // naval: 12 >= 8
    ROLL_CACHE.push(6, 6); // scout: 12 >= 10
    ROLL_CACHE.push(6, 6); // military: 12 >= 8
    sys.assignBases();
    sys.bases.should.deep.equal(['N', 'S', 'M']);
  });

  it('preserves a non-empty bases array that came from the definition', function () {
    const sys = new SolarSystem('Test');
    sys._mainWorld = { starPort: 'A' };
    sys.bases = ['N'];
    sys.basesFromDefinition = true;
    // Would produce ['N', 'S', 'M'] if assignBases rerolled instead of preserving.
    ROLL_CACHE.push(6, 6, 6, 6, 6, 6);
    sys.assignBases();
    sys.bases.should.deep.equal(['N']);
    ROLL_CACHE.length.should.equal(6);
  });

  it('preserves an explicitly empty bases array that came from the definition', function () {
    const sys = new SolarSystem('Test');
    sys._mainWorld = { starPort: 'A' };
    sys.bases = [];
    sys.basesFromDefinition = true;
    // Would produce ['N', 'S', 'M'] if assignBases rerolled instead of preserving.
    ROLL_CACHE.push(6, 6, 6, 6, 6, 6);
    sys.assignBases();
    sys.bases.should.deep.equal([]);
    ROLL_CACHE.length.should.equal(6);
  });
});

describe('bases in the build definition (generateStarSystem)', function () {
  it('applies a non-empty definition.bases to the system', function () {
    const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP, bases: ['N', 'S'] });
    sys.bases.should.deep.equal(['N', 'S']);
    sys.basesFromDefinition.should.be.true;
  });

  it('applies an explicitly empty definition.bases array', function () {
    const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP, bases: [] });
    sys.bases.should.deep.equal([]);
    sys.basesFromDefinition.should.be.true;
  });

  it('leaves bases to be generated when the definition does not specify them', function () {
    const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP });
    sys.basesFromDefinition.should.be.false;
  });
});