'use strict';

const chai = require('chai');

const RingGenerator = require('../rings/RingGenerator');
const { clearCache, ROLL_CACHE } = require('../dice');

chai.should();

describe('RingGenerator', function () {
  afterEach(function () {
    clearCache();
  });

  it('computes centre location as 0.4 + 2D/8 and span as 3D/100 + 0.07', function () {
    // 2D = 1+1 = 2 -> centre = 0.4 + 2/8 = 0.65
    // 3D = 1+1+1 = 3 -> span = 3/100 + 0.07 = 0.10
    ROLL_CACHE.push(1, 1, 1, 1, 1);
    const [ring] = RingGenerator.generate(1);
    ring.centreLocation.should.be.closeTo(0.65, 1e-9);
    ring.span.should.be.closeTo(0.1, 1e-9);
  });

  it('pushes a second overlapping ring outward so it touches the first ring\'s outer edge', function () {
    // Ring 1: 2D=1+3=4 -> centre 0.4+4/8=0.9; 3D=6+6+6=18 -> span 0.25 (outer edge 1.025, no surface clamp)
    // Ring 2: 2D=1+3=4 -> centre 0.9 (would overlap); 3D=1+1+1=3 -> span 0.10
    ROLL_CACHE.push(1, 3, 6, 6, 6, 1, 3, 1, 1, 1);
    const [ring1, ring2] = RingGenerator.generate(2);
    ring1.centreLocation.should.be.closeTo(0.9, 1e-9);
    ring1.span.should.be.closeTo(0.25, 1e-9);
    ring2.span.should.be.closeTo(0.1, 1e-9);
    // inner edge of ring2 should sit exactly at ring1's outer edge
    (ring2.centreLocation - ring2.span / 2).should.be.closeTo(
      ring1.centreLocation + ring1.span / 2,
      1e-9
    );
  });

  it('narrows a ring whose inner edge would dip inside 0.55 PD', function () {
    // centre 0.65, span 0.25 -> inner edge 0.525, below the 0.55 surface limit
    ROLL_CACHE.push(1, 1, 6, 6, 6);
    const [ring] = RingGenerator.generate(1);
    ring.centreLocation.should.be.closeTo(0.65, 1e-9);
    (ring.centreLocation - ring.span / 2).should.be.closeTo(0.55, 1e-9);
    ring.span.should.be.lessThan(0.25);
  });

  it('generates no rings when count is 0', function () {
    RingGenerator.generate(0).should.deep.equal([]);
  });
});
