'use strict';

const chai = require('chai');
chai.should();

const generateStarSystem = require('../solarSystems/generateStarSystem');

const TERRESTRIAL_UWP = 'B874409-A';

describe('governmentTypes config (generateStarSystem)', function () {
  it('is undefined when neither definition nor subsector specify it', function () {
    const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP });
    chai.expect(sys.governmentTypes).to.be.undefined;
  });

  it('takes governmentTypes from the subsector when the definition does not specify it', function () {
    const subsector = { type: 'EMPTY', unusualChance: 0, governmentTypes: [6, 7] };
    const sys = generateStarSystem({ uwp: TERRESTRIAL_UWP }, subsector);
    sys.governmentTypes.should.deep.equal([6, 7]);
  });

  it('lets the definition override the subsector governmentTypes', function () {
    const subsector = { type: 'EMPTY', unusualChance: 0, governmentTypes: [6, 7] };
    const sys = generateStarSystem(
      { uwp: TERRESTRIAL_UWP, governmentTypes: [3] },
      subsector
    );
    sys.governmentTypes.should.deep.equal([3]);
  });
});