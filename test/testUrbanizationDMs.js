'use strict';

const chai = require('chai');
const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { urbanizationDMs } = require('../population/assignUrbanizationPercentage');

chai.should();

// Neutral field values that, on their own, contribute no DM (except techLevel,
// which always contributes something -- see NEUTRAL_TL_DM below).
const NEUTRAL = {
  size: 5,
  pcr: 4,
  techLevel: 7, // falls in the TL5-9 bracket: +2, and outside the TL0-3 "minimal sustainable" band
  population: 4,
  government: 3,
  lawLevel: 3,
  atmosphere: 10, // outside both the agricultural (4-9) and non-agricultural (<=3) atmosphere bands
  hydrographics: 9, // outside both the agricultural (4-8) and non-agricultural (<=3) hydrographics bands
};
const NEUTRAL_TL_DM = 2; // the TL5-9 bracket contribution baked into NEUTRAL.techLevel

const buildPlanet = (overrides = {}) => {
  const fields = { ...NEUTRAL, ...overrides };
  const planet = new TerrestrialPlanet(fields.size);
  planet.population.concentrationRating = fields.pcr;
  planet.population.code = fields.population;
  planet.techLevel.code = fields.techLevel;
  planet.government.code = fields.government;
  planet.lawLevel.code = fields.lawLevel;
  planet.atmosphere.code = fields.atmosphere;
  planet.hydrographics.code = fields.hydrographics;
  return planet;
};

describe('urbanizationDMs', function () {
  it('is just the TL bracket DM when every other field is neutral', function () {
    urbanizationDMs(buildPlanet()).should.equal(NEUTRAL_TL_DM);
  });

  describe('population concentration rating (PCR)', function () {
    it('DM = -3 + PCR for PCR 0', function () {
      urbanizationDMs(buildPlanet({ pcr: 0 })).should.equal(NEUTRAL_TL_DM + -3);
    });

    it('DM = -3 + PCR for PCR 1', function () {
      urbanizationDMs(buildPlanet({ pcr: 1 })).should.equal(NEUTRAL_TL_DM + (-3 + 1));
    });

    it('DM = -3 + PCR for PCR 2', function () {
      urbanizationDMs(buildPlanet({ pcr: 2 })).should.equal(NEUTRAL_TL_DM + (-3 + 2));
    });

    it('has no DM for PCR 3 (just below the 0-2 band)', function () {
      urbanizationDMs(buildPlanet({ pcr: 3 })).should.equal(NEUTRAL_TL_DM);
    });

    it('has no DM for PCR 6 (just below the 7+ band)', function () {
      urbanizationDMs(buildPlanet({ pcr: 6 })).should.equal(NEUTRAL_TL_DM);
    });

    it('DM = -6 + PCR for PCR 7', function () {
      urbanizationDMs(buildPlanet({ pcr: 7 })).should.equal(NEUTRAL_TL_DM + (-6 + 7));
    });

    it('DM = -6 + PCR for PCR 9', function () {
      urbanizationDMs(buildPlanet({ pcr: 9 })).should.equal(NEUTRAL_TL_DM + (-6 + 9));
    });
  });

  describe('tech level (minimal-sustainable band + TL bracket combined)', function () {
    it('TL 0 is -3 (minimal-sustainable -1, bracket -2)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 0 })).should.equal(-3);
    });

    it('TL 2 is -3 (minimal-sustainable -1, bracket -2)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 2 })).should.equal(-3);
    });

    it('TL 3 is -2 (minimal-sustainable -1, bracket -1)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 3 })).should.equal(-2);
    });

    it('TL 4 is +1 (no minimal-sustainable, bracket +1)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 4 })).should.equal(1);
    });

    it('TL 5 is +2 (no minimal-sustainable, bracket +2)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 5 })).should.equal(2);
    });

    it('TL 9 is +2 (no minimal-sustainable, bracket +2)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 9 })).should.equal(2);
    });

    it('TL 10 is +1 (no minimal-sustainable, bracket +1)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 10 })).should.equal(1);
    });

    it('TL 15 is +1 (no minimal-sustainable, bracket +1)', function () {
      urbanizationDMs(buildPlanet({ techLevel: 15 })).should.equal(1);
    });
  });

  describe('size', function () {
    it('DM +2 for size 0', function () {
      urbanizationDMs(buildPlanet({ size: 0 })).should.equal(NEUTRAL_TL_DM + 2);
    });

    it('no DM for non-zero size', function () {
      urbanizationDMs(buildPlanet({ size: 1 })).should.equal(NEUTRAL_TL_DM);
    });
  });

  describe('population code', function () {
    it('DM +1 for population 8', function () {
      urbanizationDMs(buildPlanet({ population: 8 })).should.equal(NEUTRAL_TL_DM + 1);
    });

    it('DM +2 for population 9', function () {
      urbanizationDMs(buildPlanet({ population: 9 })).should.equal(NEUTRAL_TL_DM + 2);
    });

    it('DM +4 for population 10 (A)', function () {
      urbanizationDMs(buildPlanet({ population: 10 })).should.equal(NEUTRAL_TL_DM + 4);
    });

    it('DM +4 for population 14 (still A+)', function () {
      urbanizationDMs(buildPlanet({ population: 14 })).should.equal(NEUTRAL_TL_DM + 4);
    });

    it('no DM for population 7 (just below the band)', function () {
      urbanizationDMs(buildPlanet({ population: 7 })).should.equal(NEUTRAL_TL_DM);
    });
  });

  describe('government', function () {
    it('DM -2 for government 0', function () {
      urbanizationDMs(buildPlanet({ government: 0 })).should.equal(NEUTRAL_TL_DM - 2);
    });

    it('no DM for non-zero government', function () {
      urbanizationDMs(buildPlanet({ government: 1 })).should.equal(NEUTRAL_TL_DM);
    });
  });

  describe('law level', function () {
    it('DM +1 for law level 9', function () {
      urbanizationDMs(buildPlanet({ lawLevel: 9 })).should.equal(NEUTRAL_TL_DM + 1);
    });

    it('DM +1 for law level 12', function () {
      urbanizationDMs(buildPlanet({ lawLevel: 12 })).should.equal(NEUTRAL_TL_DM + 1);
    });

    it('no DM for law level 8 (just below the band)', function () {
      urbanizationDMs(buildPlanet({ lawLevel: 8 })).should.equal(NEUTRAL_TL_DM);
    });
  });

  describe('agricultural / non-agricultural', function () {
    it('DM -2 when agricultural (atmosphere 4-9, hydrographics 4-8, population 5-7)', function () {
      const planet = buildPlanet({ atmosphere: 6, hydrographics: 6, population: 6 });
      urbanizationDMs(planet).should.equal(NEUTRAL_TL_DM - 2);
    });

    it('DM +2 when non-agricultural (atmosphere <=3, hydrographics <=3, population >= 6)', function () {
      const planet = buildPlanet({ atmosphere: 2, hydrographics: 2, population: 6 });
      urbanizationDMs(planet).should.equal(NEUTRAL_TL_DM + 2);
    });
  });

  describe('combined DMs', function () {
    it('sums every applicable DM independently', function () {
      // pcr=1 (-2), TL=3 (minimal -1, bracket -1 = -2), size=0 (+2),
      // population=9 (+2), government=0 (-2), lawLevel=9 (+1),
      // non-agricultural via atmosphere=2/hydrographics=2/population=9 (+2)
      const planet = buildPlanet({
        pcr: 1,
        techLevel: 3,
        size: 0,
        population: 9,
        government: 0,
        lawLevel: 9,
        atmosphere: 2,
        hydrographics: 2,
      });
      urbanizationDMs(planet).should.equal(1);
    });
  });
});
