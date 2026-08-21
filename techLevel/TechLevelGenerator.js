'use strict';

const { d3, twoD6, randomInt } = require('../dice');
const habitabilityRating = require('../utils/habitabilityRating');
const { isIndustrial, isRich, isPoor } = require('../economics/assignTradeCodes');

class TechLevelGenerator {
  static starPortTechLevelDMs(planet) {
    if (planet.starport === 'A') return 6;
    else if (planet.starport === 'B') return 4;
    else if (planet.starport === 'C') return 2;
    else if (planet.starport === 'X') return -4;
    return 0;
  }

  static techLevelDMs(planet) {
    let dm = 0;
    if (planet.size < 2) dm += 2;
    else if (planet.size <= 4) dm += 1;

    if (planet.atmosphere.code <= 3) dm += 1;
    else if (planet.atmosphere.code >= 10 && planet.atmosphere.code <= 17) dm += 1;

    if (planet.hydrographics.code === 0) dm += 1;
    else if (planet.hydrographics.code === 9) dm += 1;
    else if (planet.hydrographics.code === 10) dm += 2;

    if (planet.population.code >= 1 && planet.population.code <= 5) dm += 1;
    else if (planet.population.code === 8) dm += 1;
    else if (planet.population.code === 9) dm += 2;
    else if (planet.population.code >= 10) dm += 4;

    if (planet.government.code === 0) dm += 1;
    else if (planet.government.code === 5) dm += 1;
    else if (planet.government.code === 7) dm += 2;
    else if (planet.government.code === 13) dm -= 2;
    else if (planet.government.code === 14) dm -= 2;

    dm += this.starPortTechLevelDMs(planet);

    return dm;
  }

  static nativeSophontTechLevelDMs(star, planet) {
    let dm = 0;
    if (star.age < 1) dm -= 1;
    else if (star.age >= 2 && star.age < 4) dm += 1;
    else if (star.age >= 4) dm += 2;

    if (planet.government.code === 1) dm += 1;
    else if (planet.government.code === 5) dm += 1;
    else if (planet.government.code === 7) dm += 1;

    if (planet.population.code > 7) dm += 1;
    return dm;
  }

  // WBH p.172 -- minimum tech level a rolled (non-native) population must have to survive
  // its environment. Native sophonts are adapted to their environment, so the chart doesn't
  // apply to them.
  static environmentMinTechLevel(planet) {
    if (planet.nativeSophont) return 0;

    let minTL = 0;
    switch (planet.atmosphere.code) {
      case 0:
      case 1:
      case 10:
        minTL = Math.max(minTL, 8);
        break;
      case 2:
      case 3:
      case 13:
      case 14:
        minTL = Math.max(minTL, 5);
        break;
      case 4:
      case 7:
      case 9:
        minTL = Math.max(minTL, 3);
        break;
      case 11:
        minTL = Math.max(minTL, 9);
        break;
      case 12:
        minTL = Math.max(minTL, 10);
        break;
      case 15:
        minTL = Math.max(minTL, 8);
        break;
      case 16:
      case 17:
        minTL = Math.max(minTL, 14);
        break;
    }

    const habitability = habitabilityRating(planet);
    if (habitability === 0) minTL = Math.max(minTL, 8);
    else if (habitability <= 2) minTL = Math.max(minTL, 5);
    else if (habitability <= 7) minTL = Math.max(minTL, 3);

    return minTL;
  }

  static computeTechLevel(planet, { min, max } = {}) {
    const dm = this.techLevelDMs(planet);
    const environmentMinTechLevel = this.environmentMinTechLevel(planet);

    const naturalMin = 1 + dm;
    const naturalMax = 6 + dm;

    const requestedMin = min ?? naturalMin;
    const requestedMax = max ?? naturalMax;

    const effectiveMin = Math.max(requestedMin, environmentMinTechLevel);
    const effectiveMax = requestedMax;

    planet.techLevel.dm = dm;
    planet.techLevel.environmentMinTechLevel = environmentMinTechLevel;
    planet.techLevel.min = min ?? null;
    planet.techLevel.max = max ?? null;
    planet.techLevel.floorExceededCeiling = effectiveMin > effectiveMax;

    if (planet.techLevel.floorExceededCeiling) {
      console.warn(
        `TechLevelGenerator.computeTechLevel: effective minimum (${effectiveMin}) exceeded ` +
          `effective maximum (${effectiveMax}) [dm=${dm}, environmentMinTechLevel=${environmentMinTechLevel}, ` +
          `min=${min}, max=${max}]; raising the maximum to match.`
      );
      planet.techLevel.code = effectiveMin;
      return;
    }

    if (min == null && max == null) {
      // Unbounded: sample directly from the natural window.
      planet.techLevel.code = randomInt(effectiveMin, effectiveMax);
      return;
    }

    // Bounded: roll within the object's own natural window, then rescale that
    // roll's position onto the configured [effectiveMin, effectiveMax] band so
    // the full band is used regardless of where the natural window sits.
    const roll = randomInt(naturalMin, naturalMax);
    const naturalWidth = naturalMax - naturalMin; // always 5
    const bandWidth = effectiveMax - effectiveMin;
    const offset = Math.round(((roll - naturalMin) / naturalWidth) * bandWidth);
    planet.techLevel.code = effectiveMin + offset;
  }

  static computeNativeTechLevel(star, planet, { min = 1, max = 15 } = {}) {
    const dm = this.nativeSophontTechLevelDMs(star, planet);
    let tl = d3() + d3() + d3() - 2 + dm;
    tl = Math.max(min, tl);
    tl = Math.min(max, tl);

    planet.techLevel.dm = dm;
    planet.techLevel.min = min;
    planet.techLevel.max = max;
    planet.techLevel.code = tl;
  }

  static techLevelModifiers() {
    switch (twoD6()) {
      case 2:
        return -3;
      case 3:
        return -2;
      case 4:
        return -1;
      case 10:
        return 1;
      case 11:
        return 2;
      case 12:
        return 3;
    }
    return 0;
  }

  static subTL(tl, upper, lower, planet) {
    const floor = Math.max(lower, this.environmentMinTechLevel(planet) - 2);
    return Math.floor(Math.min(Math.max(tl, floor), upper));
  }

  // WBH p.176
  static energy(planet) {
    let tl = planet.techLevel.highCommonTechLevel + this.techLevelModifiers();
    if (isIndustrial(planet)) tl += 1;
    if (planet.population.code >= 9) tl += 1;

    planet.techLevel.energy = this.subTL(
      tl,
      planet.techLevel.code * 1.2,
      planet.techLevel.code / 2,
      planet
    );
  }

  // WBH p.176
  static electronics(planet) {
    let tl = planet.techLevel.highCommonTechLevel + this.techLevelModifiers();
    if (isIndustrial(planet)) tl += 1;

    if (planet.population.code <= 5) tl += 1;
    else if (planet.population.code >= 9) tl += -1;

    planet.techLevel.electronics = this.subTL(
      tl,
      planet.techLevel.energy + 1,
      planet.techLevel.energy - 3,
      planet
    );
  }

  // WBH p.176
  static manufacturing(planet) {
    let tl = planet.techLevel.highCommonTechLevel + this.techLevelModifiers();

    if (isIndustrial(planet)) tl += 1;

    if (planet.population.code <= 6) tl -= 1;
    else if (planet.population.code >= 8) tl += -1;

    planet.techLevel.manufacturing = this.subTL(
      tl,
      Math.max(planet.techLevel.energy, planet.techLevel.electronics),
      planet.techLevel.electronics - 2,
      planet
    );
  }

  // WBH p.177
  static medical(planet) {
    let tl = planet.techLevel.electronics + this.techLevelModifiers();

    if (isRich(planet)) tl += 1;
    if (isPoor(planet)) tl -= 1;

    planet.techLevel.medical = this.subTL(
      tl,
      planet.techLevel.electronics,
      Math.max(0, this.starPortTechLevelDMs(planet)),
      planet
    );
  }

  // WBH p.177
  static environmental(planet) {
    let tl = planet.techLevel.manufacturing + this.techLevelModifiers();

    if (planet.habitabilityRating < 8) tl += 8 - planet.habitabilityRating;

    planet.techLevel.environmental = this.subTL(
      tl,
      planet.techLevel.energy,
      planet.techLevel.energy - 5,
      planet
    );
  }

  // WBH p.177
  static landTransport(planet) {
    let tl = planet.techLevel.energy + this.techLevelModifiers();

    if (planet.hydrographics.code === 10) tl -= 1;
    if (planet.population.concentrationRating <= 2) tl += 1;

    planet.techLevel.landTransport = this.subTL(
      tl,
      planet.techLevel.energy,
      planet.techLevel.electronics - 5,
      planet
    );
  }

  // WBH p.177
  static waterTransport(planet) {
    let tl = planet.techLevel.energy + this.techLevelModifiers();

    if (planet.hydrographics.code === 0) tl -= 2;
    else if (planet.hydrographics.code === 8) tl += 1;
    else if (planet.hydrographics.code >= 9) tl += 2;

    if (planet.population.concentrationRating <= 2) tl += 1;

    const lowerBound = planet.hydrographics.code === 0 ? 0 : planet.techLevel.electronics - 5;
    planet.techLevel.waterTransport = this.subTL(tl, planet.techLevel.energy, lowerBound, planet);
  }

  // WBH p.177
  static airTransport(planet) {
    if (planet.atmosphere.code === 0 && planet.techLevel.code <= 5) {
      planet.techLevel.airTransport = 0;
      return;
    }

    let tl = planet.techLevel.energy + this.techLevelModifiers();

    if (planet.atmosphere.code <= 3 || planet.atmosphere.code === 14) {
      if (planet.techLevel.code <= 7) tl -= 2;
    } else if (planet.atmosphere.code === 4 || planet.atmosphere.code === 5) {
      if (planet.techLevel.code <= 7) tl -= 1;
      else tl += 1;
    }

    planet.techLevel.airTransport = this.subTL(
      tl,
      planet.techLevel.energy,
      planet.techLevel.electronics - 5,
      planet
    );
  }

  // WBH p.178
  static spaceTransport(planet) {
    let tl = planet.techLevel.manufacturing + this.techLevelModifiers();

    if (planet.size.code === '0' || planet.size.code === 'S' || planet.size.code === '1') tl += 2;

    if (planet.population.code <= 5) tl -= 1;
    else if (planet.population.code >= 9) tl += 1;
    if (planet.starport === 'A') tl += 2;
    else if (planet.starport === 'B') tl += 1;

    planet.techLevel.spaceTransport = this.subTL(
      tl,
      Math.min(planet.techLevel.energy, planet.techLevel.manufacturing),
      Math.min(planet.techLevel.energy - 3, planet.techLevel.manufacturing - 3),
      planet
    );
  }

  // WBH p.178
  static personalMilitary(planet) {
    let tl = planet.techLevel.manufacturing + this.techLevelModifiers();

    if (planet.government.code === 0 || planet.government.code === 7) tl += 2;
    if (planet.lawLevel.code === 0) tl += 2;
    else if (planet.lawLevel.code === 7) tl += 2;
    else if (planet.lawLevel.code <= 4) tl += 1;
    else if (planet.lawLevel.code >= 9 || planet.lawLevel.code <= 12) tl += 1;
    const lowerBound = planet.lawLevel.weaponsAndArmour === 0 ? planet.techLevel.manufacturing : 0;
    planet.techLevel.personalMilitary = this.subTL(
      tl,
      planet.techLevel.electronics,
      lowerBound,
      planet
    );
  }

  // WBH p.179
  static heavyMilitary(planet) {
    let tl = planet.techLevel.manufacturing + this.techLevelModifiers();

    if (planet.population.code <= 6) tl -= 1;
    else if (planet.population.code >= 8) tl += 1;

    switch (planet.government.code) {
      case 7:
      case 10:
      case 11:
      case 15:
        tl += 2;
        break;
    }

    if (planet.lawLevel.code >= 13) tl += 2;

    planet.techLevel.heavyMilitary = this.subTL(tl, planet.techLevel.manufacturing, 0, planet);
  }

  static lowCommonTechLevel(planet) {
    let tl = planet.techLevel.code;
    tl += this.techLevelModifiers();
    if (planet.population.code <= 5) tl += 1;
    else if (planet.population.code >= 9) tl += -1;

    if (planet.population.concentrationRating <= 2) tl += -1;
    else if (planet.population.concentrationRating >= 7) tl += 1;

    switch (planet.government.code) {
      case 0:
      case 6:
      case 13:
      case 14:
        tl += -1;
        break;
      case 5:
        tl += 1;
        break;
      case 7:
        tl += -2;
        break;
    }

    const floor = Math.max(planet.techLevel.code / 2, this.environmentMinTechLevel(planet) - 2);
    return Math.min(Math.max(tl, floor), planet.techLevel.code);
  }

  // WBH p.173
  static computeTechLevelDetails(planet) {
    if (planet.population.code === 0) return;
    planet.techLevel.highCommonTechLevel = planet.techLevel.code;
    planet.techLevel.lowCommonTechLevel = this.lowCommonTechLevel(planet);
    this.energy(planet);
    this.electronics(planet);
    this.manufacturing(planet);
    this.medical(planet);
    this.environmental(planet);
    this.landTransport(planet);
    this.waterTransport(planet);
    this.airTransport(planet);
    this.spaceTransport(planet);
    this.personalMilitary(planet);
    this.heavyMilitary(planet);
  }
}

module.exports = TechLevelGenerator;
