'use strict';

const chai = require('chai');

const TerrestrialPlanet = require('../terrestrialPlanet/terrestrialPlanet');
const { clearCache, ROLL_CACHE } = require('../dice');
const StarportCapacityGenerator = require('../starportCapacity/StarportCapacityGenerator');

chai.should();

describe('StarportCapacityGenerator.hasHighport', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('rolls 2D6 vs. 6+ for class A', function () {
    planet.starPort = 'A';
    ROLL_CACHE.push(3, 3); // 6
    StarportCapacityGenerator.hasHighport(planet).should.equal(true);
  });

  it('rolls 2D6 vs. 8+ for class B', function () {
    planet.starPort = 'B';
    ROLL_CACHE.push(3, 4); // 7, below target
    StarportCapacityGenerator.hasHighport(planet).should.equal(false);
  });

  it('rolls 2D6 vs. 10+ for class C', function () {
    planet.starPort = 'C';
    ROLL_CACHE.push(5, 5); // 10
    StarportCapacityGenerator.hasHighport(planet).should.equal(true);
  });

  it('rolls 2D6 vs. 12+ for class D', function () {
    planet.starPort = 'D';
    ROLL_CACHE.push(5, 6); // 11, below target
    StarportCapacityGenerator.hasHighport(planet).should.equal(false);
  });

  it('applies a +1 DM for population 9+', function () {
    planet.starPort = 'B';
    planet.population.code = 9;
    ROLL_CACHE.push(3, 4); // 7 + 1 = 8
    StarportCapacityGenerator.hasHighport(planet).should.equal(true);
  });

  it('applies a +1 DM for TL 9-11', function () {
    planet.starPort = 'B';
    planet.techLevel.code = 10;
    ROLL_CACHE.push(3, 4); // 7 + 1 = 8
    StarportCapacityGenerator.hasHighport(planet).should.equal(true);
  });

  it('applies a +2 DM for TL 12+, not stacked with the TL 9-11 DM', function () {
    planet.starPort = 'A';
    planet.techLevel.code = 12;
    ROLL_CACHE.push(2, 2); // 4 + 2 = 6
    StarportCapacityGenerator.hasHighport(planet).should.equal(true);
  });

  it('stacks the population and TL DMs', function () {
    planet.starPort = 'D';
    planet.population.code = 10;
    planet.techLevel.code = 15;
    ROLL_CACHE.push(4, 5); // 9 + 1 + 2 = 12
    StarportCapacityGenerator.hasHighport(planet).should.equal(true);
  });

  it('class E never has a highport, with no roll consumed', function () {
    planet.starPort = 'E';
    StarportCapacityGenerator.hasHighport(planet).should.equal(false);
    ROLL_CACHE.length.should.equal(0);
  });

  it('class X never has a highport, with no roll consumed', function () {
    planet.starPort = 'X';
    StarportCapacityGenerator.hasHighport(planet).should.equal(false);
    ROLL_CACHE.length.should.equal(0);
  });
});

describe('StarportCapacityGenerator.highportRollDM', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('is 0 below population 9 and TL 9', function () {
    planet.population.code = 8;
    planet.techLevel.code = 8;
    StarportCapacityGenerator.highportRollDM(planet).should.equal(0);
  });

  it('is +1 for population 9+', function () {
    planet.population.code = 9;
    planet.techLevel.code = 8;
    StarportCapacityGenerator.highportRollDM(planet).should.equal(1);
  });

  it('is +1 for TL 9-11', function () {
    planet.population.code = 0;
    planet.techLevel.code = 11;
    StarportCapacityGenerator.highportRollDM(planet).should.equal(1);
  });

  it('is +2 for TL 12+, not +3', function () {
    planet.population.code = 0;
    planet.techLevel.code = 20;
    StarportCapacityGenerator.highportRollDM(planet).should.equal(2);
  });

  it('stacks the population and TL DMs', function () {
    planet.population.code = 9;
    planet.techLevel.code = 12;
    StarportCapacityGenerator.highportRollDM(planet).should.equal(3);
  });
});

describe('StarportCapacityGenerator.highportCapacity', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('computes class A capacity', function () {
    planet.starPort = 'A';
    planet.population.code = 6;
    planet.economics = { importance: 3, efficiency: 0 };
    ROLL_CACHE.push(5); // efficiencyMultiplier = 1 + (5 + 0) / 5 = 2
    StarportCapacityGenerator.highportCapacity(planet).should.equal(640000);
  });

  it('computes class D capacity and rounds up to the nearest 100', function () {
    planet.starPort = 'D';
    planet.population.code = 2;
    planet.economics = { importance: -2, efficiency: -5 };
    ROLL_CACHE.push(1); // efficiencyMultiplier = 1 + (1 - 5) / 5 = 0.2
    // 500 + max(1,-2)=1 * expectedWeekly(-2)=2 * 100 * 2 * 0.2 = 500 + 80 = 580 -> 600
    StarportCapacityGenerator.highportCapacity(planet).should.equal(600);
  });

  it('returns null for classes with no highport formula', function () {
    planet.starPort = 'E';
    planet.economics = { importance: 0, efficiency: 0 };
    (StarportCapacityGenerator.highportCapacity(planet) === null).should.equal(true);
  });
});

describe('StarportCapacityGenerator.downportCapacity', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('class X has no downport capacity', function () {
    planet.starPort = 'X';
    StarportCapacityGenerator.downportCapacity(planet, false, null).should.equal(0);
  });

  it('class E uses the smaller class E formula', function () {
    planet.starPort = 'E';
    planet.population.code = 5;
    planet.economics = { importance: 0, efficiency: 0 };
    ROLL_CACHE.push(3); // efficiencyMultiplier = 1 + (3 + 0) / 5 = 1.6
    // 400 + max(1,0)=1 * expectedWeekly(0)=5 * 100 * 5 * 1.6 = 400 + 4000 = 4400
    StarportCapacityGenerator.downportCapacity(planet, false, null).should.equal(4400);
  });

  it('classes A-D without a highport reuse the highport formula', function () {
    planet.starPort = 'C';
    planet.population.code = 4;
    planet.economics = { importance: 4, efficiency: 2 };
    ROLL_CACHE.push(4); // efficiencyMultiplier = 1 + (4 + 2) / 5 = 2.2
    // 20000 + 4 * 150 * 200 * 4 * 2.2 = 20000 + 1056000 = 1076000
    StarportCapacityGenerator.downportCapacity(planet, false, null).should.equal(1076000);
  });

  it('classes A-D with a highport default to 1D x 10% of highport capacity', function () {
    planet.starPort = 'A';
    ROLL_CACHE.push(4); // 1D roll for the downport, 4 * 0.1 * 640000 = 256000
    StarportCapacityGenerator.downportCapacity(planet, true, 640000).should.equal(256000);
  });
});

describe('StarportCapacityGenerator.internalBayCapacity', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('is 10% of highport capacity, rounded up to the nearest 100', function () {
    planet.starPort = 'A';
    StarportCapacityGenerator.internalBayCapacity(planet, 640000).should.equal(64000);
  });

  it('is 0 for a class D highport', function () {
    planet.starPort = 'D';
    StarportCapacityGenerator.internalBayCapacity(planet, 700).should.equal(0);
  });

  it('is 0 when there is no highport', function () {
    planet.starPort = 'C';
    StarportCapacityGenerator.internalBayCapacity(planet, null).should.equal(0);
  });
});

describe('StarportCapacityGenerator.shipyardCapability', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('maps each starport class to its shipyard capability', function () {
    const expected = {
      A: 'starships',
      B: 'spacecraft',
      C: 'smallCraft',
      D: 'none',
      E: 'none',
      X: 'none',
    };
    for (const [starPort, capability] of Object.entries(expected)) {
      planet.starPort = starPort;
      StarportCapacityGenerator.shipyardCapability(planet).should.equal(capability);
    }
  });
});

describe('StarportCapacityGenerator.assign', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('does nothing for an unpopulated world', function () {
    planet.population.code = 0;
    StarportCapacityGenerator.assign(planet);
    (planet.starportCapacity === undefined).should.equal(true);
  });

  it('assigns every field for a class X world, with no dice required', function () {
    planet.starPort = 'X';
    planet.population.code = 5;
    planet.economics = { importance: 0, efficiency: 0 };
    StarportCapacityGenerator.assign(planet);
    planet.starportCapacity.should.deep.equal({
      hasHighport: false,
      highport: null,
      downport: 0,
      internalBayCapacity: 0,
      shipyardCapability: 'none',
      shipyardBuildCapacity: null,
      annualShipyardOutput: null,
    });
  });
});

describe('StarportCapacityGenerator.techLevelYardDM', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('applies the correct DM per tech level band', function () {
    planet.techLevel.code = 5;
    StarportCapacityGenerator.techLevelYardDM(planet).should.equal(-4);

    planet.techLevel.code = 8;
    StarportCapacityGenerator.techLevelYardDM(planet).should.equal(-4);

    planet.techLevel.code = 10;
    StarportCapacityGenerator.techLevelYardDM(planet).should.equal(0);

    planet.techLevel.code = 13;
    StarportCapacityGenerator.techLevelYardDM(planet).should.equal(2);

    planet.techLevel.code = 15;
    StarportCapacityGenerator.techLevelYardDM(planet).should.equal(4);

    planet.techLevel.code = 20;
    StarportCapacityGenerator.techLevelYardDM(planet).should.equal(4);
  });
});

describe('StarportCapacityGenerator.industryYardDM', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('is +2 for an industrial world', function () {
    planet.atmosphere.code = 0;
    planet.population.code = 10;
    StarportCapacityGenerator.industryYardDM(planet).should.equal(2);
  });

  it('is -2 for a non-industrial world', function () {
    planet.population.code = 5;
    StarportCapacityGenerator.industryYardDM(planet).should.equal(-2);
  });

  it('is 0 for neither', function () {
    planet.atmosphere.code = 6;
    planet.population.code = 7;
    StarportCapacityGenerator.industryYardDM(planet).should.equal(0);
  });
});

describe('StarportCapacityGenerator.yardBuildCapacity', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('computes class A capacity when at or above the 10,000 ton floor', function () {
    planet.techLevel.code = 15; // DM +4
    planet.population.code = 8; // neutral for industry DM
    planet.population.censusPopulation = 10000000;
    planet.economics = { efficiency: 5, infrastructure: 5 };
    ROLL_CACHE.push(6); // 1D
    // (5 + 5 + 6 + 4) * (10,000,000 / 20,000) = 20 * 500 = 10,000
    StarportCapacityGenerator.classAYardBuildCapacity(planet).should.equal(10000);
  });

  it('applies the 9,000 + 1D x 500 floor when class A capacity is under 10,000 tons', function () {
    planet.techLevel.code = 10; // DM 0
    planet.population.code = 8;
    planet.population.censusPopulation = 200000;
    planet.economics = { efficiency: 1, infrastructure: 2 };
    ROLL_CACHE.push(4, 3); // 1D for the base roll, 1D for the floor roll
    // (1 + 2 + 4 + 0) * (200,000 / 20,000) = 7 * 10 = 70 -> below floor
    StarportCapacityGenerator.classAYardBuildCapacity(planet).should.equal(9000 + 3 * 500);
  });

  it('applies the 4,000 + 2D x 100 floor when class B capacity is under 5,000 tons', function () {
    planet.techLevel.code = 10; // DM 0
    planet.population.code = 7;
    planet.population.censusPopulation = 1000000;
    planet.economics = { efficiency: 2, infrastructure: 1 };
    ROLL_CACHE.push(3, 3, 4); // 1D for the base roll, 2D for the floor roll
    // (2 + 1 + 3 + 0) * (1,000,000 / 100,000) = 6 * 10 = 60 -> below floor
    StarportCapacityGenerator.classBYardBuildCapacity(planet).should.equal(4000 + 7 * 100);
  });

  it('computes class C capacity using a 1D-3 roll', function () {
    planet.techLevel.code = 10; // DM 0
    planet.population.code = 7;
    planet.population.censusPopulation = 15000;
    planet.economics = { efficiency: 2, infrastructure: 3 };
    ROLL_CACHE.push(5); // 1D-3 = 2
    // (2 + 3 + 2 + 0) * (15,000 / 15,000) = 7
    StarportCapacityGenerator.classCYardBuildCapacity(planet).should.equal(100);
  });

  it('returns null when class C capacity is clearly negative', function () {
    planet.techLevel.code = 5; // DM -4
    planet.population.code = 5; // non-industrial, DM -2
    planet.population.censusPopulation = 15000;
    planet.economics = { efficiency: -5, infrastructure: -140 };
    ROLL_CACHE.push(1); // 1D-3 = -2
    // (-5 - 140 - 2 - 6) * (15,000 / 15,000) = -153
    (StarportCapacityGenerator.classCYardBuildCapacity(planet) === null).should.equal(true);
  });

  it('returns null, not 0, when a small negative raw capacity would round up to exactly 0', function () {
    planet.techLevel.code = 10; // DM 0
    planet.population.code = 7; // neutral for industry DM
    planet.population.censusPopulation = 15000;
    planet.economics = { efficiency: 0, infrastructure: -47 };
    ROLL_CACHE.push(1); // 1D-3 = -2
    // (0 - 47 - 2 + 0) * (15,000 / 15,000) = -49 -> would round up to 0,
    // which must not be mistaken for a working 0-ton shipyard
    (StarportCapacityGenerator.classCYardBuildCapacity(planet) === null).should.equal(true);
  });

  it('returns null, not 0, for an exact 0 raw capacity', function () {
    planet.techLevel.code = 10; // DM 0
    planet.population.code = 7; // neutral for industry DM
    planet.population.censusPopulation = 15000;
    planet.economics = { efficiency: 2, infrastructure: 0 };
    ROLL_CACHE.push(1); // 1D-3 = -2
    // (2 + 0 - 2 + 0) * (15,000 / 15,000) = 0
    (StarportCapacityGenerator.classCYardBuildCapacity(planet) === null).should.equal(true);
  });

  it('dispatches to the right class formula, and returns null for D/E/X', function () {
    planet.starPort = 'D';
    (StarportCapacityGenerator.yardBuildCapacity(planet) === null).should.equal(true);

    planet.starPort = 'E';
    (StarportCapacityGenerator.yardBuildCapacity(planet) === null).should.equal(true);

    planet.starPort = 'X';
    (StarportCapacityGenerator.yardBuildCapacity(planet) === null).should.equal(true);
  });
});

describe('StarportCapacityGenerator.annualShipyardOutput', function () {
  let planet;

  beforeEach(() => {
    clearCache();
    planet = new TerrestrialPlanet(7);
  });

  it('is null when there is no shipyard', function () {
    (StarportCapacityGenerator.annualShipyardOutput(planet, null) === null).should.equal(true);
  });

  it('is build capacity x 10 for class C, regardless of importance', function () {
    planet.starPort = 'C';
    planet.economics = { importance: 5 };
    StarportCapacityGenerator.annualShipyardOutput(planet, 100).should.equal(1000);
  });

  it('is build capacity / importance for class A/B at importance 1+', function () {
    planet.starPort = 'A';
    planet.economics = { importance: 5 };
    StarportCapacityGenerator.annualShipyardOutput(planet, 10000).should.equal(2000);
  });

  it('is build capacity x (1 - importance) for class A/B at importance 0 or below', function () {
    planet.starPort = 'B';
    planet.economics = { importance: -2 };
    StarportCapacityGenerator.annualShipyardOutput(planet, 4700).should.equal(4700 * 3);
  });
});
