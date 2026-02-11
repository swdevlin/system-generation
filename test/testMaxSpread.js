"use strict";

const chai = require('chai');

const Star = require("../stars/star");
const StellarClassification = require("../stars/StellarClassification");
const {ORBIT_TYPES} = require("../utils");
const {clearCache, ROLL_CACHE} = require("../dice");
const {computeMaxSpread} = require("../solarSystems/loadPlanetsFromDefinition");

chai.should();

const makeStar = () => {
  const classification = new StellarClassification();
  classification.stellarClass = 'V';
  classification.stellarType = 'G';
  classification.subtype = 0;
  return new Star(classification, ORBIT_TYPES.PRIMARY);
};

describe("Max Spread", function () {

  afterEach(function () {
    clearCache();
  });

  describe("computeMaxSpread", function () {
    const mockStar = {hzco: 3.0, minimumAllowableOrbit: 0.2};

    it("returns null when no bodies have orbit labels", function () {
      const bodies = [
        {uwp: 'X000000-0'},
        {uwp: 'empty'},
        {uwp: 'Small Gas Giant'},
      ];
      const result = computeMaxSpread(mockStar, bodies);
      chai.expect(result).to.be.null;
    });

    it("returns null when only body at index 0 has a label", function () {
      const bodies = [
        {uwp: 'X000000-0', orbit: 'warm'},
        {uwp: 'empty'},
      ];
      const result = computeMaxSpread(mockStar, bodies);
      chai.expect(result).to.be.null;
    });

    it("returns null for outer label", function () {
      const bodies = [
        {uwp: 'empty'},
        {uwp: 'empty'},
        {uwp: 'Small Gas Giant', orbit: 'outer'},
      ];
      const result = computeMaxSpread(mockStar, bodies);
      chai.expect(result).to.be.null;
    });

    it("calculates maxSpread for warm label", function () {
      const bodies = [
        {uwp: 'empty'},
        {uwp: 'empty'},
        {uwp: 'empty'},
        {uwp: 'empty'},
        {uwp: 'X000000-0', orbit: 'warm'},
      ];
      // warm target = hzco = 3.0
      // maxSpread = (3.0 - 0.2) / ((4 + 1) * 1.3) = 2.8 / 6.5
      const expected = 2.8 / 6.5;
      const result = computeMaxSpread(mockStar, bodies);
      result.should.be.approximately(expected, 0.001);
    });

    it("calculates maxSpread for cold label", function () {
      const bodies = [
        {uwp: 'empty'},
        {uwp: 'empty'},
        {uwp: 'X000000-0', orbit: 'cold'},
      ];
      // cold target = hzco + 1 = 4.0
      // maxSpread = (4.0 - 0.2) / ((2 + 1) * 1.3) = 3.8 / 3.9
      const expected = 3.8 / 3.9;
      const result = computeMaxSpread(mockStar, bodies);
      result.should.be.approximately(expected, 0.001);
    });

    it("calculates maxSpread for habitable label", function () {
      const bodies = [
        {uwp: 'empty'},
        {uwp: 'X000000-0', orbit: 'habitable'},
      ];
      // habitable target = hzco + 1 = 4.0
      // maxSpread = (4.0 - 0.2) / ((1 + 1) * 1.3) = 3.8 / 2.6
      const expected = 3.8 / 2.6;
      const result = computeMaxSpread(mockStar, bodies);
      result.should.be.approximately(expected, 0.001);
    });

    it("calculates maxSpread for inner label", function () {
      const bodies = [
        {uwp: 'empty'},
        {uwp: 'X000000-0', orbit: 'inner'},
      ];
      // inner target = hzco - 1 = 2.0
      // maxSpread = (2.0 - 0.2) / ((1 + 1) * 1.3) = 1.8 / 2.6
      const expected = 1.8 / 2.6;
      const result = computeMaxSpread(mockStar, bodies);
      result.should.be.approximately(expected, 0.001);
    });

    it("returns most restrictive when multiple labels present", function () {
      const bodies = [
        {uwp: 'empty'},
        {uwp: 'X000000-0', orbit: 'cold'},    // target 4.0, i=1 → 3.8 / (2*1.3) = 1.462
        {uwp: 'empty'},
        {uwp: 'empty'},
        {uwp: 'X000000-0', orbit: 'warm'},    // target 3.0, i=4 → 2.8 / (5*1.3) = 0.431
      ];
      // warm is more restrictive
      const expected = 2.8 / (5 * 1.3);
      const result = computeMaxSpread(mockStar, bodies);
      result.should.be.approximately(expected, 0.001);
    });

    it("returns null when target is at or below minimumAllowableOrbit", function () {
      const dimStar = {hzco: 0.5, minimumAllowableOrbit: 0.4};
      const bodies = [
        {uwp: 'empty'},
        {uwp: 'empty'},
        {uwp: 'X000000-0', orbit: 'inner'},  // target = hzco - 1 = -0.5
      ];
      const result = computeMaxSpread(dimStar, bodies);
      chai.expect(result).to.be.null;
    });
  });

  describe("assignOrbits with maxSpread", function () {
    it("caps spread when maxSpread is smaller than calculated spread", function () {
      const star = makeStar();
      star.totalObjects = 5;
      star.availableOrbits = [[0.03, 20]];
      star.orbit = 0;

      // Push enough dice for computeBaseline (2d6), computeBaselineOrbitNumber (2d6),
      // emptyOrbits (2d6), then markOccupiedOrbits (2d6 per orbit)
      // Use rolls that would produce a large spread
      for (let i = 0; i < 40; i++)
        ROLL_CACHE.push(4);

      star.assignOrbits(null, 0.05);
      star.spread.should.be.at.most(0.05);
    });

    it("does not cap spread when maxSpread is null", function () {
      const star = makeStar();
      star.totalObjects = 5;
      star.availableOrbits = [[0.03, 20]];
      star.orbit = 0;

      for (let i = 0; i < 40; i++)
        ROLL_CACHE.push(4);

      star.assignOrbits(null, null);
      star.spread.should.be.greaterThan(0);
    });

    it("does not cap spread when maxSpread is larger than calculated spread", function () {
      const star = makeStar();
      star.totalObjects = 5;
      star.availableOrbits = [[0.03, 20]];
      star.orbit = 0;

      for (let i = 0; i < 40; i++)
        ROLL_CACHE.push(4);

      const largeCap = 100;
      star.assignOrbits(null, largeCap);
      star.spread.should.be.lessThan(largeCap);
    });
  });

  describe("resetNonStarBodies with maxSpread", function () {
    it("passes maxSpread through to assignOrbits", function () {
      const star = makeStar();
      star.totalObjects = 5;
      star.availableOrbits = [[0.03, 20]];
      star.orbit = 0;

      // Initial assignOrbits call
      for (let i = 0; i < 40; i++)
        ROLL_CACHE.push(4);
      star.assignOrbits(null);
      const uncappedSpread = star.spread;

      // resetNonStarBodies with maxSpread cap
      const cap = uncappedSpread / 2;
      for (let i = 0; i < 40; i++)
        ROLL_CACHE.push(4);
      star.resetNonStarBodies(5, cap);
      star.spread.should.be.at.most(cap);
    });
  });
});
