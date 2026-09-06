'use strict';

const { twoD6, twoD6InRange } = require('../dice');
const { determineStarport } = require('../terrestrialPlanet/assignStarport');
const TechLevelGenerator = require('../techLevel/TechLevelGenerator');
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
    const codeMin = min !== undefined ? min : 0;
    const codeMax = max !== undefined ? max : 10;
    let roll = twoD6InRange(codeMin + 2, codeMax + 2) - 2;
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
      return;
    }
    const govCode = this.world.government.code;
    const codeMin = Math.max(0, law?.min ?? 0);
    const codeMax = law?.max !== undefined ? law.max : 5 + govCode; // natural ceiling: 2d6 max(12) - 7 + govCode
    let roll = Math.max(0, twoD6InRange(codeMin + 7 - govCode, codeMax + 7 - govCode) - 7 + govCode);
    if (law) {
      if (law.min !== undefined) roll = Math.max(law.min, roll);
      if (law.max !== undefined) roll = Math.min(law.max, roll);
    }
    this.world.lawLevel.code = roll;
  }

  assignStarport() {
    const sp =
      this.spec.starport !== undefined ? this.spec.starport : determineStarport(this.world);
    this.world.starPort = sp;
    this.world.starport = sp;
  }

  assignTechLevel() {
    if (typeof this.world.techLevel !== 'object' || this.world.techLevel === null) {
      this.world.techLevel = {
        code: typeof this.world.techLevel === 'number' ? this.world.techLevel : 0,
      };
    }
    const tl = this.spec.techLevel;
    TechLevelGenerator.computeTechLevel(this.world, { min: tl?.min, max: tl?.max });
  }
}

module.exports = SocialCharacteristicsAssigner;
