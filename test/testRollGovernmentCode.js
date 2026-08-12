'use strict';

const chai = require('chai');
chai.should();

const { rollGovernmentCode } = require('../government/rollGovernmentCode');
const { ROLL_CACHE, clearCache } = require('../dice');

describe('rollGovernmentCode', function () {
  beforeEach(() => clearCache());

  it('rolls the standard formula when unconstrained', function () {
    ROLL_CACHE.push(4, 4); // twoD6 = 8
    const code = rollGovernmentCode(3); // 8 - 7 + 3 = 4
    code.should.equal(4);
  });

  it('clamps negative results to 0', function () {
    ROLL_CACHE.push(1, 1); // twoD6 = 2
    const code = rollGovernmentCode(0); // 2 - 7 + 0 = -5 -> 0
    code.should.equal(0);
  });

  it('rerolls captive government (code 6) when not allowed', function () {
    ROLL_CACHE.push(6, 6); // twoD6 = 12 -> code 6, rejected
    ROLL_CACHE.push(3, 3); // twoD6 = 6 -> code 0, accepted
    const code = rollGovernmentCode(1, { allowCaptiveGovernment: false });
    code.should.equal(0);
  });

  it('rerolls until the code is in governmentTypes', function () {
    ROLL_CACHE.push(2, 2); // twoD6 = 4 -> code 4, not permitted
    ROLL_CACHE.push(4, 5); // twoD6 = 9 -> code 9, permitted
    const code = rollGovernmentCode(7, { governmentTypes: [9] });
    code.should.equal(9);
  });

  it('applies both allowCaptiveGovernment and governmentTypes filters together', function () {
    ROLL_CACHE.push(6, 6); // twoD6 = 12 -> code 6, rejected (captive government disallowed)
    ROLL_CACHE.push(2, 2); // twoD6 = 4 -> code 4, rejected (not in governmentTypes)
    ROLL_CACHE.push(4, 5); // twoD6 = 9 -> code 9, permitted
    const code = rollGovernmentCode(7, {
      allowCaptiveGovernment: false,
      governmentTypes: [9],
    });
    code.should.equal(9);
  });

  it('falls back to a random permitted code if no roll ever matches within the attempt cap', function () {
    const code = rollGovernmentCode(0, { governmentTypes: [99] });
    code.should.equal(99);
  });

  it('fallback never returns 6 when allowCaptiveGovernment is false, even if 6 is permitted', function () {
    for (let i = 0; i < 20; i++) {
      clearCache();
      const code = rollGovernmentCode(0, {
        allowCaptiveGovernment: false,
        governmentTypes: [6, 99],
      });
      code.should.equal(99);
    }
  });

  it('throws when governmentTypes only contains 6 and allowCaptiveGovernment is false', function () {
    (() => rollGovernmentCode(0, { allowCaptiveGovernment: false, governmentTypes: [6] })).should.throw(
      /governmentTypes/
    );
  });
});