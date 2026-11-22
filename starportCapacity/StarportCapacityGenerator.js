'use strict';

const { d6, twoD6 } = require('../dice');
const { isIndustrial, isNonIndustrial } = require('../economics/assignTradeCodes');

// WBH p.198-199

const HIGHPORT_ROLL_TARGET = { A: 6, B: 8, C: 10, D: 12 };

const HIGHPORT_FORMULA = {
  A: { base: 100000, trafficMultiplier: 500 },
  B: { base: 50000, trafficMultiplier: 500 },
  C: { base: 20000, trafficMultiplier: 200 },
  D: { base: 500, trafficMultiplier: 100 },
};

const SHIPYARD_CAPABILITY = {
  A: 'starships',
  B: 'spacecraft',
  C: 'smallCraft',
};

// WBH p.197 -- Expected Ship Traffic, keyed by Importance. Rows below -3
// ("Uncharted"/"Unexplored") don't apply to populated worlds, so importance
// is clamped to [-3, 6] ("+"/Exceptional Trade Hub) before lookup.
const EXPECTED_WEEKLY_TRAFFIC_BY_IMPORTANCE = [
  { importance: 6, traffic: 2000 },
  { importance: 5, traffic: 1000 },
  { importance: 4, traffic: 150 },
  { importance: 3, traffic: 30 },
  { importance: 2, traffic: 20 },
  { importance: 1, traffic: 10 },
  { importance: 0, traffic: 5 },
  { importance: -1, traffic: 3 },
  { importance: -2, traffic: 2 },
  { importance: -3, traffic: 1 },
];

class StarportCapacityGenerator {
  static roundUpToHundred(value) {
    return Math.ceil(value / 100) * 100;
  }

  static expectedWeeklyTraffic(importance) {
    const clamped = Math.max(-3, Math.min(6, importance));
    return EXPECTED_WEEKLY_TRAFFIC_BY_IMPORTANCE.find((row) => clamped >= row.importance).traffic;
  }

  // The page notes the actual importance picks the Expected Weekly row, but
  // importance below +1 is treated as +1 when used as a multiplier.
  static formulaImportance(importance) {
    return Math.max(1, importance);
  }

  static efficiencyMultiplier(planet) {
    return 1 + (d6() + (planet.economics.efficiency || 0)) / 5;
  }

  static highportRollDM(planet) {
    let dm = 0;
    if (planet.population.code >= 9) dm += 1;
    if (planet.techLevel.code >= 12) dm += 2;
    else if (planet.techLevel.code >= 9) dm += 1;
    return dm;
  }

  static hasHighport(planet) {
    const target = HIGHPORT_ROLL_TARGET[planet.starPort];
    if (!target) return false;
    return twoD6() + this.highportRollDM(planet) >= target;
  }

  static highportCapacity(planet) {
    const formula = HIGHPORT_FORMULA[planet.starPort];
    if (!formula) return null;

    const importance = this.formulaImportance(planet.economics.importance);
    const expectedWeekly = this.expectedWeeklyTraffic(planet.economics.importance);

    const capacity =
      formula.base +
      importance *
        expectedWeekly *
        formula.trafficMultiplier *
        planet.population.code *
        this.efficiencyMultiplier(planet);

    return this.roundUpToHundred(capacity);
  }

  static classEDownportCapacity(planet) {
    const importance = this.formulaImportance(planet.economics.importance);
    const expectedWeekly = this.expectedWeeklyTraffic(planet.economics.importance);

    const capacity =
      400 +
      importance * expectedWeekly * 100 * planet.population.code * this.efficiencyMultiplier(planet);

    return this.roundUpToHundred(capacity);
  }

  // On a world with a highport, the downport is a minor facility. WBH leaves
  // its size to the Referee; we default to the first of the two suggested
  // options (1D x 10% of highport capacity) rather than the vaguer "split
  // the capacity" alternative.
  static downportCapacity(planet, hasHighport, highportCapacity) {
    if (planet.starPort === 'X') return 0;

    if (hasHighport) {
      return this.roundUpToHundred(d6() * 0.1 * highportCapacity);
    }

    if (planet.starPort === 'E') return this.classEDownportCapacity(planet);

    // A world without a highport must have enough downport capacity to
    // qualify for its starport classification -- the same calculation as
    // for highport capacity (WBH p.196).
    return this.highportCapacity(planet);
  }

  // Simplified: WBH only describes internal bay capacity as a rule of
  // thumb (~10% of total docking capacity), not a formula; a Class D
  // highport rarely has any.
  static internalBayCapacity(planet, highportCapacity) {
    if (!highportCapacity || planet.starPort === 'D') return 0;
    return this.roundUpToHundred(highportCapacity * 0.1);
  }

  // Qualitative, from the Starport Facilities table -- WBH gives no numeric
  // tonnage formula for shipyard build capacity.
  static shipyardCapability(planet) {
    return SHIPYARD_CAPABILITY[planet.starPort] || 'none';
  }

  static techLevelYardDM(planet) {
    const tl = planet.techLevel.code;
    if (tl <= 8) return -4;
    if (tl >= 15) return 4;
    if (tl >= 12) return 2;
    return 0;
  }

  static industryYardDM(planet) {
    if (isIndustrial(planet)) return 2;
    if (isNonIndustrial(planet)) return -2;
    return 0;
  }

  static classAYardBuildCapacity(planet) {
    const dm = this.techLevelYardDM(planet) + this.industryYardDM(planet);
    const factor = planet.economics.efficiency + planet.economics.infrastructure + d6() + dm;
    const capacity = this.roundUpToHundred(factor * (planet.population.censusPopulation / 20000));
    return capacity < 10000 ? 9000 + d6() * 500 : capacity;
  }

  static classBYardBuildCapacity(planet) {
    const dm = this.techLevelYardDM(planet) + this.industryYardDM(planet);
    const factor = planet.economics.efficiency + planet.economics.infrastructure + d6() + dm;
    const capacity = this.roundUpToHundred(factor * (planet.population.censusPopulation / 100000));
    return capacity < 5000 ? 4000 + twoD6() * 100 : capacity;
  }

  static classCYardBuildCapacity(planet) {
    const dm = this.techLevelYardDM(planet) + this.industryYardDM(planet);
    const factor = planet.economics.efficiency + planet.economics.infrastructure + (d6() - 3) + dm;
    const rawCapacity = factor * (planet.population.censusPopulation / 15000);
    // Checked before rounding: rounding a small negative raw value up to the
    // nearest 100 can land on exactly 0, which would otherwise disguise "no
    // functional shipyard" as a working 0-ton one.
    if (rawCapacity <= 0) return null;
    return this.roundUpToHundred(rawCapacity);
  }

  // WBH p.198 -- only classes A-C can build ships; D/E/X have no shipyard.
  static yardBuildCapacity(planet) {
    switch (planet.starPort) {
      case 'A':
        return this.classAYardBuildCapacity(planet);
      case 'B':
        return this.classBYardBuildCapacity(planet);
      case 'C':
        return this.classCYardBuildCapacity(planet);
      default:
        return null;
    }
  }

  // WBH p.198 -- Class C output doesn't follow the importance-based scaling;
  // it's always 10x build capacity.
  static annualShipyardOutput(planet, yardBuildCapacity) {
    if (!yardBuildCapacity) return null;
    if (planet.starPort === 'C') return yardBuildCapacity * 10;

    const importance = planet.economics.importance;
    return importance >= 1 ? yardBuildCapacity / importance : yardBuildCapacity * (1 - importance);
  }

  static assign(planet) {
    if (planet.population.code === 0) return;

    const hasHighport = this.hasHighport(planet);
    const highport = hasHighport ? this.highportCapacity(planet) : null;
    const yardBuildCapacity = this.yardBuildCapacity(planet);

    planet.starportCapacity = {
      hasHighport,
      highport,
      downport: this.downportCapacity(planet, hasHighport, highport),
      internalBayCapacity: this.internalBayCapacity(planet, highport),
      shipyardCapability: this.shipyardCapability(planet),
      shipyardBuildCapacity: yardBuildCapacity,
      annualShipyardOutput: this.annualShipyardOutput(planet, yardBuildCapacity),
    };
  }
}

module.exports = StarportCapacityGenerator;
