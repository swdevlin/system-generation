'use strict';

const { twoD6, d6 } = require('../dice');
const { determineStarport } = require('../terrestrialPlanet/assignStarport');
const { techLevelDMs } = require('../terrestrialPlanet/assignTechLevel');
const { assignTradeCodes } = require('../economics/assignTradeCodes');
const { applyPopulationDetails } = require('../population/applyPopulationDetails');

class SocialCharacteristicsAssigner {
  constructor(world, star, spec, starSystem) {
    this.world = world;
    this.star = star;
    this.spec = spec;
    this.starSystem = starSystem;
  }

  assign() {
    this.assignPopulation();
    this.assignGovernment();
    this.assignLawLevel();
    this.assignStarport();
    this.assignTechLevel();
    assignTradeCodes(this.world);
    applyPopulationDetails(this.star, this.world, this.starSystem);
  }

  assignPopulation() {
    const { min, max } = this.spec.population;
    let roll;
    let attempts = 0;
    do {
      roll = twoD6() - 2;
      attempts++;
    } while (
      attempts < 100 &&
      ((min !== undefined && roll < min) || (max !== undefined && roll > max))
    );
    if (min !== undefined) roll = Math.max(min, roll);
    if (max !== undefined) roll = Math.min(max, roll);
    this.world.population.code = roll;
  }

  assignGovernment() {
    const gov = this.spec.government;
    const allowCaptive = this.spec.allowCaptiveGovernment ?? true;
    if (typeof gov === 'number') {
      this.world.government.code = gov;
    } else {
      do {
        this.world.government.code = Math.max(twoD6() - 7 + this.world.population.code, 0);
      } while (this.world.government.code === 6 && !allowCaptive);
    }
  }

  assignLawLevel() {
    const law = this.spec.lawLevel;
    if (typeof law === 'number') {
      this.world.lawLevel.code = law;
    } else {
      this.world.lawLevel.code = Math.max(twoD6() - 7 + this.world.government.code, 0);
    }
  }

  assignStarport() {
    const sp = this.spec.starport !== undefined ? this.spec.starport : determineStarport(this.world);
    this.world.starPort = sp;
    this.world.starport = sp;
  }

  assignTechLevel() {
    const tl = this.spec.techLevel;
    let roll;
    let attempts = 0;
    do {
      roll = d6() + techLevelDMs(this.world);
      attempts++;
    } while (
      attempts < 100 &&
      tl &&
      ((tl.min !== undefined && roll < tl.min) || (tl.max !== undefined && roll > tl.max))
    );
    if (tl) {
      if (tl.min !== undefined) roll = Math.max(tl.min, roll);
      if (tl.max !== undefined) roll = Math.min(tl.max, roll);
    }
    this.world.techLevel = roll;
  }
}

module.exports = SocialCharacteristicsAssigner;
